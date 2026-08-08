import { LeagueRosterIdsMap, Cache } from "@/features/local-storage/local-storage";
import { WEEKS } from "@/utils/consts";
import { trpc } from "@/utils/trpc";
import { useState, useEffect } from "react";

// @TODO: error handling
export const useSleeperUserMatchupsData = (week: WEEKS, leagueRosterIds?: LeagueRosterIdsMap, settings?: Cache['settings']) => {
    const [filteredLeagueRosterIds, setFilteredRosterIds] = useState<LeagueRosterIdsMap>();
    const {data: matchups, isLoading: isMatchupsLoading} = trpc.useQuery(['sleeper-api.getMatchupsData', {
        week,
        leagueRosterIds: filteredLeagueRosterIds!,
        closeMatchupMargin: settings?.shouldShowCloseMatchupMargin ? settings?.closeMatchupMargin : undefined
    }]);
    const leagueIgnores = settings?.leagueIgnoresMap;

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
    }, [leagueRosterIds, leagueIgnores]);

    return {matchups, isMatchupsLoading};
}