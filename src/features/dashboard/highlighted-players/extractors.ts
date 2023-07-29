import { Starters } from "@/features/leagues/leagues.types";
import { HighlightedPlayerType, HIGHLIGHTED_PLAYER_TYPES } from "./types";
import { LeagueWeightsMap, getLocalStorageData } from "@/features/local-storage/local-storage";

const getWeightTotal = (leagues: {[leagueId: string]: number}, leagueWeightsMap: LeagueWeightsMap) => {
    return Object.keys(leagues).reduce((acc, currentLeagueId) => acc + leagueWeightsMap[currentLeagueId]!, 0);
}

const computeConflictScore = (userLeagues?: {[leagueId: string]: number}, oppLeagues?: {[leagueId: string]: number}) => {
    const {leagueWeightsMap} = getLocalStorageData('settings');
    if (leagueWeightsMap && userLeagues && oppLeagues) {
        const userWeightTotal = getWeightTotal(userLeagues, leagueWeightsMap);
        const oppWeightTotal = getWeightTotal(oppLeagues, leagueWeightsMap);
        const userRatio = userWeightTotal / (userWeightTotal + oppWeightTotal);
        return isNaN(userRatio) ? 0 : Math.round(userRatio * 100);
    }
    return 0;
};

export const getHighlightedPlayers = (userLeagueInfo: Starters, oppLeagueInfo: Starters): Record<string, {hightlightedPlayerType: HighlightedPlayerType, conflictScore?: number}> => {
    const userHighlighted = Object.entries(userLeagueInfo).reduce((acc, [playerId, playerLeagueInfo]) => {
        if (playerLeagueInfo.isConflicted) {
            const conflictScore = computeConflictScore(playerLeagueInfo.leagues, oppLeagueInfo[playerId]?.leagues);
            return { ...acc, [playerId]: {hightlightedPlayerType: HIGHLIGHTED_PLAYER_TYPES.CONFLICTED, conflictScore} };
        }
        else if (Object.keys(playerLeagueInfo.leagues ?? {}).length > 1) return { ...acc, [playerId]: {hightlightedPlayerType: HIGHLIGHTED_PLAYER_TYPES.ROOT} }
        else return acc;
    }, {});
    const highLightedPlayers = Object.entries(oppLeagueInfo).reduce((acc, [playerId, playerLeagueInfo]) => {
        if (playerLeagueInfo.isConflicted) return { ...acc} 
        else if (Object.keys(playerLeagueInfo.leagues ?? {}).length > 1) return { ...acc, [playerId]: {hightlightedPlayerType: HIGHLIGHTED_PLAYER_TYPES.BOO} }
        else return acc;
    }, userHighlighted);
    return highLightedPlayers;
}