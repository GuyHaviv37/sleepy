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

export const extractSleeperMatchupData = (matchupsData: any, userSleeperId: string) => {
    return {
        userMatchupData: {},
        opponentMatchupData: {}
    }
}