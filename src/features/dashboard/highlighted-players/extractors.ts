import { Starters } from "@/features/leagues/leagues.types";
import { HighlightedPlayerType, HIGHLIGHTED_PLAYER_TYPES } from "./types";

export const getHighlightedPlayers = (userLeagueInfo: Starters, oppLeagueInfo: Starters): Record<string, HighlightedPlayerType> => {
    const userHighlighted = Object.entries(userLeagueInfo).reduce((acc, [playerId, playerLeagueInfo]) => {
        if (playerLeagueInfo.isConflicted) return { ...acc, [playerId]: HIGHLIGHTED_PLAYER_TYPES.CONFLICTED }
        else if (Object.keys(playerLeagueInfo.leagues ?? {}).length > 1) return { ...acc, [playerId]: HIGHLIGHTED_PLAYER_TYPES.ROOT }
        else return acc;
    }, {});
    const highLightedPlayers = Object.entries(oppLeagueInfo).reduce((acc, [playerId, playerLeagueInfo]) => {
        if (playerLeagueInfo.isConflicted) return { ...acc, [playerId]: HIGHLIGHTED_PLAYER_TYPES.CONFLICTED }
        else if (Object.keys(playerLeagueInfo.leagues ?? {}).length > 1) return { ...acc, [playerId]: HIGHLIGHTED_PLAYER_TYPES.BOO }
        else return acc;
    }, userHighlighted);
    return highLightedPlayers;
}