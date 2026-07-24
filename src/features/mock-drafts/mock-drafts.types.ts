export type SleeperDraftMetadata = {
    start_time: number;
    draft_id: string;
    metadata: {
        scoring_type: 'standard' | 'half_ppr' | 'ppr' //@TODO: add all types
        draft_order?: Record<string, number>;
    },
    settings: {
        teams: number;
        slots_qb: number;
        slots_wr: number;
        slots_rb: number;
        slots_te: number;
    }
}

export type DraftCategory = `${SleeperDraftMetadata['metadata']['scoring_type']}-${SleeperDraftMetadata['settings']['teams']}-${SleeperDraftMetadata['settings']['slots_qb']}-${SleeperDraftMetadata['settings']['slots_wr']}`

export type SleeperDraftPick = {
    player_id: string;
    picked_by: string;
    pick_no: number;
    draft_slot: number;
    round: number;
    metadata: {
        team: string; //@TODO: we have enum for this?
        first_name: string;
        last_name: string;
        number: string;
        position: string //@TODO: we have enum for this?
    }
}