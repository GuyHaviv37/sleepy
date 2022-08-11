type Competition = { competitors: {homeAway: 'home' | 'away'; team: {abbreviation: string; displayName: string}}[] }
type Event = { date: string; competitions: Competition[] };
type EspnScheduleData = { events: Event[] };

// notice some teams have BYES so check if a schedule.team is defined
export type ScheduleData = {
    [teamAbv: string]: {
        timeslot?: string; // @TODO - we will see what that should be
        oppTeam?: string;
        homeAway?: string;
    }
}

export const extractScheduleData = (espnScheduleData: EspnScheduleData): ScheduleData => {
    const scheduleData = espnScheduleData.events.reduce((acc: ScheduleData, event) => {
        const eventTeams: string[] = event.competitions[0]?.competitors.map(competitor => competitor.team.abbreviation) ?? [];
        const [teamA, teamB] = eventTeams;
        if (!teamA || !teamB) {
            throw Error('Schedule Error: an event does not have 2 teams');
        }
        const eventData = {
            [teamA]: {
                oppTeam: teamB,
                homeAway: event.competitions[0]?.competitors[0]?.homeAway,
                timeslot: event.date
            },
            [teamB]: {
                oppTeam: teamA,
                homeAway: event.competitions[0]?.competitors[1]?.homeAway,
                timeslot: event.date
            }
        }
        return {...acc, ...eventData};
    }, {});
    return scheduleData;
}