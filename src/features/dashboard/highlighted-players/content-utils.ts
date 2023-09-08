import { HIGHLIGHTED_PLAYER_TYPES, type HighlightedPlayerType } from "./types";

export const getConflictScoreColor = (conflictScore: number | undefined) => {
    if (conflictScore === undefined) return;
    if (conflictScore <= 15) {
        return 'text-rose-600'
    } else if (conflictScore <=35) {
        return 'text-rose-400'
    } else if (conflictScore >= 85) {
        return 'text-emerald-500'
    } else if (conflictScore >= 65) {
        return 'text-emerald-200'
    }
}

export const getHighlightPlayerLabel = (playerHighlightType: HighlightedPlayerType, showPlayerConflictScore: boolean) => {
    if (playerHighlightType === HIGHLIGHTED_PLAYER_TYPES.CONFLICTED && showPlayerConflictScore) {
        return 'Conflict Score: ';
    } else if (playerHighlightType === HIGHLIGHTED_PLAYER_TYPES.CONFLICTED) {
        return 'Conflicted';
    } else if (playerHighlightType === HIGHLIGHTED_PLAYER_TYPES.ROOT) {
        return 'Strong Root';
    } else if (playerHighlightType === HIGHLIGHTED_PLAYER_TYPES.BOO) {
        return 'Strong \"Boo\"';
    } else return '';
}