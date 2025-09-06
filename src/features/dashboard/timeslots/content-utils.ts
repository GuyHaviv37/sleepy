import { EMOJIES } from "../consts";
import { HIGHLIGHTED_PLAYER_TYPES, HighlightedPlayerType } from "../highlighted-players/types";

export const getTimeslotString = (timeslot: string) => {
    const timeslotDate = new Date(timeslot);
    return timeslotDate.toLocaleString('en', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

export const getCondensedTimeslotString = (timeslot: string) => {
    const timeslotDate = new Date(timeslot);
    return timeslotDate.toLocaleString('en', { weekday: 'short', hour: 'numeric', minute: 'numeric' });
};

export const getStarterHighlightType = (multipliers?: number, isConflicted?: boolean, isUserTeam?: boolean): HighlightedPlayerType | null => {
    if (isConflicted) return HIGHLIGHTED_PLAYER_TYPES.CONFLICTED;
    const isUnconflictedMultiplier = multipliers && multipliers > 1;
    const isRoot = isUnconflictedMultiplier && isUserTeam;
    if (isRoot) return HIGHLIGHTED_PLAYER_TYPES.ROOT;
    const isBoo = isUnconflictedMultiplier && !isUserTeam;
    if (isBoo) return HIGHLIGHTED_PLAYER_TYPES.BOO;
    return null;
}

export const getHighlightStyle = (highlightType: HighlightedPlayerType) => {
    switch (highlightType) {
        case HIGHLIGHTED_PLAYER_TYPES.CONFLICTED:
            return { emoji: EMOJIES.SWORDS_EMOJI, backgroundColor: 'bg-yellow-200', textColor: 'text-yellow-200' };
        case HIGHLIGHTED_PLAYER_TYPES.ROOT:
            return { emoji: EMOJIES.THUNDER_EMOJI, backgroundColor: 'bg-emerald-500', textColor: 'text-emerald-500' };
        case HIGHLIGHTED_PLAYER_TYPES.BOO:
            return { emoji: EMOJIES.THUMBS_DOWN_EMOJI, backgroundColor: 'bg-red-500', textColor: 'text-red-500' };
    }
}