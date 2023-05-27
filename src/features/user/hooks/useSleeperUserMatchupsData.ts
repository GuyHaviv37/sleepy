import { LeagueRosterIdsMap, LeagueIgnoresMap } from "@/features/local-storage/local-storage";
import { WEEKS } from "@/utils/consts";
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

// @TODO: error handling
export const useSleeperUserMatchupsData = (week: WEEKS, leagueRosterIds?: LeagueRosterIdsMap, leagueIgnores?: LeagueIgnoresMap) => {
    const [filteredLeagueRosterIds, setFilteredRosterIds] = useState<LeagueRosterIdsMap>();
    const {data: matchups, isLoading: isMatchupsLoading} = trpc.useQuery(['sleeper-api.getMatchupsData', {week, leagueRosterIds: filteredLeagueRosterIds!}]);

    useEffect(() => {
        if (leagueRosterIds && leagueIgnores) {
            const newLeagueRosterIds = {...leagueRosterIds};
            Object.entries(leagueIgnores).map(([leagueId, shouldInclude]) => {
                if (!shouldInclude) {
                    delete newLeagueRosterIds[leagueId];
                }
            });
            setFilteredRosterIds(newLeagueRosterIds);
        }
    }, [leagueRosterIds]);

    return {matchups, isMatchupsLoading};
}