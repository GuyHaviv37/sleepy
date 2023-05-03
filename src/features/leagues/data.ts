import { SPORT, SEASON } from '@/utils/consts';
import { fetcher } from '@/utils/fetcher';
import type { SleeperLeagueData } from './leagues.types';

export const getSleeperUserLeagues = async (sleeperId: string): Promise<SleeperLeagueData[]> => {
    return fetcher(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`);
}