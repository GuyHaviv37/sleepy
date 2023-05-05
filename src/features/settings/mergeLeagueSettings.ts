import { SleeperLeagueData } from "../leagues/leagues.types";
import { LeagueIgnoresMap, LeagueWeightsMap } from "../local-storage/local-storage";

export const mergeLeagueSettings = (leagues: SleeperLeagueData[], currentLeagueWeights: LeagueWeightsMap, currentLeagueIgnores: LeagueIgnoresMap) => {
    const defaultLeagueWeights: LeagueWeightsMap = {};
    const defaultLeagueIgnores: LeagueIgnoresMap = {};
    const leagueIds = leagues?.map(league => league.league_id);
    const leagueIdsToRemove = Object.keys(currentLeagueWeights).filter(leagueId => !leagueIds.includes(leagueId));
    leagueIds.forEach((leagueId) => {
        if (!currentLeagueWeights[leagueId]) {
            defaultLeagueWeights[leagueId] = 0;
        }
        if (currentLeagueIgnores[leagueId] === undefined) {
            defaultLeagueIgnores[leagueId] = true;
        }
    })
    return {
        mergeLeagueWeightsMap: (currentMap: LeagueWeightsMap) => {
            const newMap = {...defaultLeagueWeights, ...currentMap};
            leagueIdsToRemove.forEach(leagueIdToRemove => {
                delete newMap[leagueIdToRemove];
            })
            return newMap;
        },
        mergeLeagueIgnoresMap: (currentMap: LeagueIgnoresMap) => {
            const newMap = {...defaultLeagueIgnores, ...currentMap};
            leagueIdsToRemove.forEach(leagueIdToRemove => {
                delete newMap[leagueIdToRemove];
            })
            return newMap;
        }
    }
};