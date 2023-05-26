import { ScheduleData } from "../schedule/schedule.types";
import { PlayersInfo, POSITION_ORDER } from "./consts";
import { StartersByTimeslot } from "./timeslots/timeslot.types";

export const extractStartersByTimeslot = (scheduleData: ScheduleData['byTeam'], timeslots: string[], starterIds: string[], playersInfo: PlayersInfo)
    : StartersByTimeslot => {
    return timeslots.reduce((acc, timeslot) => {
        const startersInTimeslot = starterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            if (!playerTeam) return false;
            const teamTimeslot = scheduleData[playerTeam]?.timeslot;
            return teamTimeslot === timeslot;
        }).sort((playerA, playerB) => {
            return POSITION_ORDER.indexOf(playersInfo[playerA]?.position ?? '') -
                POSITION_ORDER.indexOf(playersInfo[playerB]?.position ?? '')
        })
        return { ...acc, [timeslot]: startersInTimeslot }
    }, {})
}

export const extractStartersByGame = (scheduleData: ScheduleData, timeslot: string, userStarterIds: string[], oppStarterIds: string[], playersInfo: PlayersInfo) => {
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