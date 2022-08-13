type Competition = { competitors: {homeAway: 'home' | 'away'; team: {abbreviation: string; displayName: string}}[] }
type Event = { date: string; competitions: Competition[] };
type EspnScheduleData = { events: Event[] };

// notice some teams have BYES so check if a schedule.team is defined
export type ScheduleData = {
    [teamAbv: string]: {
        timeslot?: string; // @TODO - we will see what that should be
        oppTeam?: string;
        isHomeTeam?: boolean;
    }
}

export const extractScheduleData = (espnScheduleData: EspnScheduleData): ScheduleData => {
    const scheduleData = espnScheduleData.events.reduce((acc: ScheduleData, event) => {
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
    return scheduleData;
}