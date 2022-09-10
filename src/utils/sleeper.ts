type LeagueMatchup = {
    matchup_id: string;
    roster_id: string;
    starters: string[];
    starters_points: number[];
};

export type StarterInfo = {
    leagues?: {[leagueId: string]: number};
    isConflicted?: boolean;
}

export type Starters = {
    [playerId: string]: StarterInfo
}

type LeagueMatchupWithLeagueId = LeagueMatchup & {leagueId: string};

export const extractUserLeagueRosterIds = (rostersData: any, sleeperId: string): {[key:string]: string} | undefined => {
    const userRosters = rostersData.map((leagueRosters: any[]) => {
        return leagueRosters.find((leagueRoster: { owner_id: string; }) => leagueRoster.owner_id === sleeperId);
    })
    const leagueRosterIds: {[key:string]: string} = {};
    userRosters.forEach((userRoster: { league_id: string; roster_id: string; }) => {
        leagueRosterIds[userRoster.league_id] = userRoster.roster_id;
    });
    return leagueRosterIds;
}

const isUserMatchup = (rosterId?: string) => (matchup: LeagueMatchup) => matchup.roster_id === rosterId;
const isOppMatchup = (matchupId?: string, userRosterId?: string) => (matchup: LeagueMatchup) => matchup.matchup_id === matchupId && matchup.roster_id !== userRosterId;

const extractStartersData = (matchups: Partial<LeagueMatchupWithLeagueId>[]) => {
    const starterData: Starters = {};
    if (!matchups || matchups.length === 0) return;
    for (let leagueMatchup of matchups) {
        const leagueId = leagueMatchup.leagueId ?? '';
        leagueMatchup?.starters?.forEach((starter: LeagueMatchup['starters'][0], index: number) => {
            const starterScore = leagueMatchup?.starters_points?.[index] ?? 0;
            starterData[starter] = {
                ...starterData[starter],
                leagues: {
                    ...starterData[starter]?.leagues,
                    [leagueId]: starterScore,
                },
                isConflicted: false,
            }
        })
    }
    return starterData;
}

// @TODO use LeagueRosterIdsMap from index page, use type for leagueMatchupsData
export const extractSleeperMatchupData = (leagueMatchupsData: {[leagueId: string]: LeagueMatchup[]}, leagueRosterIds: {[leagueId: string]: string})
: {userStarters?: Starters; oppStarters?: Starters} => {
    const userMatchups = Object.entries(leagueMatchupsData).map(([leagueId, leagueMatchups]) => {
        const userMatchup = leagueMatchups.find(isUserMatchup(leagueRosterIds[leagueId]));
        if (!userMatchup) return {leagueId, matchup_id: 'N/A'};
        return {...userMatchup, leagueId}
    });
    const userStarters = extractStartersData(userMatchups);
    const oppMatchups = Object.entries(leagueMatchupsData).map(([leagueId, leagueMatchups], index) => {
        const matchupId = userMatchups[index]?.matchup_id;
        const userRosterId = leagueRosterIds[leagueId];
        const oppMatchup = leagueMatchups.find(isOppMatchup(matchupId, userRosterId));
        if (!oppMatchup) return {leagueId, matchup_id: 'N/A'};
        return {...oppMatchup, leagueId};
    })
    const oppStarters = extractStartersData(oppMatchups);

    // assign conflicts
    if (userStarters) {
        Object.keys(userStarters ?? {}).forEach((playerId) => {
            if (oppStarters?.[playerId]) {
                userStarters[playerId] = {...userStarters[playerId], isConflicted: true}
                oppStarters[playerId] = {...oppStarters[playerId], isConflicted: true}
            }
        })
    }

    return {
        userStarters,
        oppStarters
    }
}