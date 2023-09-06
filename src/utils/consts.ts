export const SPORT = 'nfl';
export const SEASON = '2023';

export const WEEKS = {
    WEEK1: '1',
    WEEK2: '2',
    WEEK3: '3',
    WEEK4: '4',
    WEEK5: '5',
    WEEK6: '6',
    WEEK7: '7',
    WEEK8: '8',
    WEEK9: '9',
    WEEK10: '10',
    WEEK11: '11',
    WEEK12: '12',
    WEEK13: '13',
    WEEK14: '14',
    WEEK15: '15',
    WEEK16: '16',
    WEEK17: '17',
    WEEK18: '18',
} as const;

export type WEEKS = typeof WEEKS[keyof typeof WEEKS];

export const DashboardViewTypes = {
    SLIM: 'Default',
    FULL: 'By Game'
} as const;
export type DashboardViewType = typeof DashboardViewTypes[keyof typeof DashboardViewTypes];
