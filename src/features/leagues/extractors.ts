import { LeagueRosterIdsMap } from "../local-storage/local-storage";

// @TODO: type Rosters data ? & refactor ?
export const extractUserLeagueRosterIds = (rostersData: any, sleeperId: string): LeagueRosterIdsMap => {
    const isSingleLeague = !!rostersData[0].league_id;
    const refinedRosterData = isSingleLeague ? [rostersData] : rostersData;
    const userRosters = refinedRosterData.map((leagueRosters: any[]) => {
        return leagueRosters.find((leagueRoster: { owner_id: string; }) => leagueRoster.owner_id === sleeperId);
    })
    const availableUserRosters = userRosters.filter((userRoster: any) => !!userRoster);
    const leagueRosterIds: {[key:string]: string} = {};
    availableUserRosters.forEach((userRoster: { league_id: string; roster_id: string; }) => {
        leagueRosterIds[userRoster.league_id] = userRoster.roster_id;
    });
    return leagueRosterIds;
}