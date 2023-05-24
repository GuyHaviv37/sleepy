import { ScheduleData } from "@/features/schedule/schedule.types";
import { EMOJIES, PlayersInfo, POSITTION_ORDER } from "./consts";

export const extractStartersByTimeslots = (scheduleData: ScheduleData['byTeam'], timeslots: string[], starterIds: string[], playersInfo: PlayersInfo)
    : { [timeslot: string]: string[] } => {
    return timeslots.reduce((acc, timeslot) => {
        const startersInTimeslot = starterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            if (!playerTeam) return false;
            const teamTimeslot = scheduleData[playerTeam]?.timeslot;
            return teamTimeslot === timeslot;
        }).sort((playerA, playerB) => {
            return POSITTION_ORDER.indexOf(playersInfo[playerA]?.position ?? '') -
                POSITTION_ORDER.indexOf(playersInfo[playerB]?.position ?? '')
        })
        return { ...acc, [timeslot]: startersInTimeslot }
    }, {})
}

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

export const getStartersByGame = (scheduleData: ScheduleData, timeslot: string, userStarterIds: string[], oppStarterIds: string[], playersInfo: PlayersInfo) => {
    const startersPerGame = scheduleData.byTimeslot[timeslot]?.map(game => {
        const userStartersPerGame = userStarterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            return playerTeam === game.homeTeam || playerTeam === game.awayTeam;
        })
        const oppStartersPerGame = oppStarterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            return playerTeam === game.homeTeam || playerTeam === game.awayTeam;
        })
        return {user: userStartersPerGame, opp: oppStartersPerGame};
    })
    return startersPerGame;
}