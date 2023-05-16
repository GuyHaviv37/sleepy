export type SleeperLeagueData = {
    name: string;
    league_id: string;
    roster_positions: string[];
}

export type LeagueMatchup = {
    matchup_id: string;
    roster_id: number;
    starters: string[];
    starters_points: number[];
};

export type StarterInfo = {
    leagues?: {[leagueId: string]: number};
    isConflicted?: boolean;
}

export type Starters = {
    [playerId: string]: StarterInfo
}

export type LeagueMatchupWithLeagueId = LeagueMatchup & {leagueId: string};