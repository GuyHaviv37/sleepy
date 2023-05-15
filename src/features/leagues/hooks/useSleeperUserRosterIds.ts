import { useGetLocalStorage } from "@/features/local-storage/hooks";
import { LeagueRosterIdsMap, patchLocalStorageData } from "@/features/local-storage/local-storage";
import { CacheStatus } from "@/features/local-storage/local-storage.types";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export const useSleeperUserRosterIds = (sleeperId: string) => {
    const {data: cachedLeaguesInfo, cacheStatus: cachedLeaguesInfoStatus} = useGetLocalStorage('leaguesInfo');
    const [leagueRosterIds, setLeagueRosterIds] = useState<LeagueRosterIdsMap>();
    const {isLoading} = trpc.useQuery(['sleeper-api.getLeagueRosterIds', {sleeperId}], {
        onSuccess: (leagueRosterIds) => {
            setLeagueRosterIds(leagueRosterIds);
            patchLocalStorageData('leaguesInfo', {leagueRosterIds})
        }
    })

    useEffect(() => {
        if (cachedLeaguesInfoStatus === CacheStatus.HIT) {
            setLeagueRosterIds(cachedLeaguesInfo?.leagueRosterIds);
        }
    }, [cachedLeaguesInfoStatus]);

    return {leagueRosterIds, isLeagueRosterIdsLoading: isLoading || cachedLeaguesInfoStatus === CacheStatus.LOADING};
}