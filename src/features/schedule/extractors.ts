import { EspnScheduleData, ScheduleData } from "./schedule.types";

const extractScheduleTeamData = (espnScheduleData: EspnScheduleData): ScheduleData['byTeam'] => {
    const scheduleTeamData = espnScheduleData.events.reduce((acc: ScheduleData['byTeam'], event) => {
        const eventTeams: string[] = event.competitions[0]?.competitors.map(competitor => competitor.team.abbreviation) ?? [];
        const [teamA, teamB] = eventTeams;
        if (!teamA || !teamB) {
            throw Error('Schedule Error: an event does not have 2 teams');
        }
        const isTeamAHome = event.competitions[0]?.competitors[0]?.homeAway === 'home';
        const eventData = {
            [teamA]: {
                oppTeam: teamB,
                isHomeTeam: isTeamAHome,
                timeslot: event.date
            },
            [teamB]: {
                oppTeam: teamA,
                isHomeTeam: !isTeamAHome,
                timeslot: event.date
            }
        }
        return {...acc, ...eventData};
    }, {});
    const normalizedScheduleTeamData = scheduleTeamData.WSH ? {...scheduleTeamData, WAS: scheduleTeamData.WSH} : scheduleTeamData
    return normalizedScheduleTeamData;
}

const extractScheduleTimeslotData = (espnScheduleData: EspnScheduleData): ScheduleData['byTimeslot'] => {
    const scheduleTimeslotData = espnScheduleData.events.reduce((acc: ScheduleData['byTimeslot'], event) => {
        const eventTeams: string[] = event.competitions[0]?.competitors.map(competitor => competitor.team.abbreviation) ?? [];
        const [teamA, teamB] = eventTeams;
        if (!teamA || !teamB) {
            throw Error('Schedule Error: an event does not have 2 teams');
        }
        const isTeamAHome = event.competitions[0]?.competitors[0]?.homeAway === 'home';
        const timeslot = event.date;
        const gameInfo = {
            homeTeam: isTeamAHome ? teamA : teamB,
            awayTeam: isTeamAHome ? teamB : teamA,
        };
        const timeslotGames = acc[timeslot] ? [...acc[timeslot]!, gameInfo] : [gameInfo];
        return {...acc, [timeslot]: timeslotGames}
    }, {});
    return scheduleTimeslotData;
}

export const extractScheduleData = (espnScheduleData: EspnScheduleData): ScheduleData => {
    return {
        byTeam: extractScheduleTeamData(espnScheduleData),
        byTimeslot: extractScheduleTimeslotData(espnScheduleData),
    }
}