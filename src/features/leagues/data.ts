import { SPORT, SEASON } from '@/utils/consts';
import { fetcher } from '@/utils/fetcher';
import type { SleeperLeagueData } from './leagues.types';
import { extractUserLeagueRosterIds } from './extractors';

export const getSleeperUserLeagues = async (sleeperId: string): Promise<SleeperLeagueData[]> => {
    return fetcher(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`);
}

export const getSleeperUserRosterIds = async (sleeperId:string, leagueIds: string[]) => {
    const rosterPromises = leagueIds.map(leagueId => fetcher(`https://api.sleeper.app/v1/league/${leagueId}/rosters`));
    const rosters = await Promise.all(rosterPromises);
    const leagueRosterIds = extractUserLeagueRosterIds(rosters, sleeperId);
    return leagueRosterIds;
}