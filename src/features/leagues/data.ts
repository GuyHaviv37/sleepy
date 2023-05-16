import { SPORT, SEASON, WEEKS } from '@/utils/consts';
import { fetcher } from '@/utils/fetcher';
import type { LeagueMatchup, SleeperLeagueData } from './leagues.types';
import { extractSleeperMatchupData, extractUserLeagueRosterIds } from './extractors';
import { LeagueRosterIdsMap } from '../local-storage/local-storage';

export const getSleeperUserLeagues = async (sleeperId: string): Promise<SleeperLeagueData[]> => {
    return fetcher(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`);
}

export const getSleeperUserRosterIds = async (sleeperId:string, leagueIds: string[]) => {
    const rosterPromises = leagueIds.map(leagueId => fetcher(`https://api.sleeper.app/v1/league/${leagueId}/rosters`));
    const rosters = await Promise.all(rosterPromises);
    const leagueRosterIds = extractUserLeagueRosterIds(rosters, sleeperId);
    return leagueRosterIds;
}

export const getSleeperUserMatchupsData = async (leagueIds: string[], week: WEEKS) => {
    const matchupPromises = leagueIds.map(leagueId => fetcher(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`));
    const matchupsResponse = await Promise.all(matchupPromises);
    const isSingleLeague = matchupsResponse?.[0].roster_id;
    const matchups = isSingleLeague ? [matchupsResponse] : matchupsResponse;
    if (matchups.length !== leagueIds.length) throw Error('@getSleeperUserMatchupsData: Mismatch in matchups data and leagues data');
    const leagueMatchupsData:  {[leagueId: string]: LeagueMatchup[]} = {};
    matchups && leagueIds.forEach((leagueId) => {
        const leagueIndex = leagueIds.findIndex(someLeagueId => someLeagueId === leagueId);
        leagueMatchupsData[leagueId] = matchups?.[leagueIndex]
    });
    return leagueMatchupsData;
};