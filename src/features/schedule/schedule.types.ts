type Competition = { competitors: {homeAway: 'home' | 'away'; team: {abbreviation: string; displayName: string}}[] }
type Event = { date: string; competitions: Competition[] };
export type EspnScheduleData = { events: Event[] };
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