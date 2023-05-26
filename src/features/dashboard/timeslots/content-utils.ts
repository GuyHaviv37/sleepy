import { EMOJIES } from "../consts";

export const getTimeslotString = (timeslot: string) => {
    const timeslotDate = new Date(timeslot);
    return timeslotDate.toLocaleString('en', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
}

export const getStarterEmoji = (multipliers?: number, isConflicted?: boolean, isUserTeam?: boolean) => {
    if (isConflicted) return EMOJIES.SWORDS_EMOJI;
    const isUnconflictedMultiplier = multipliers && multipliers > 1 && !isConflicted;
    const isRoot = isUnconflictedMultiplier && isUserTeam;
    if (isRoot) return EMOJIES.THUNDER_EMOJI;
    const isBoo = isUnconflictedMultiplier && !isUserTeam;
    if (isBoo) return EMOJIES.THUMBS_DOWN_EMOJI;
}