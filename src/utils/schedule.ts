type Competition = { competitors: {homeAway: 'home' | 'away'; team: {abbreviation: string; displayName: string}}[] }
type Event = { date: string; competitions: Competition[] };
type EspnScheduleData = { events: Event[] };
type GameInfo = {homeTeam: string, awayTeam: string}

// notice some teams have BYES so check if a schedule.team is defined
export type ScheduleData = {
    byTeam: {
        [teamAbv: string]: {
            timeslot?: string; // @TODO - we will see what that should be
            oppTeam?: string;
            isHomeTeam?: boolean;
        }
    },
    byTimeslot: {
        [timeslot: string]: GameInfo[],
    }
}

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
    return scheduleTeamData;
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
        const gameInfo: GameInfo = {
            homeTeam: isTeamAHome ? teamA : teamB,
            awayTeam: isTeamAHome ? teamB : teamA,
        };
        const timeslotGames = acc[timeslot] ? [...(acc[timeslot] as GameInfo[]), gameInfo] : [gameInfo];
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