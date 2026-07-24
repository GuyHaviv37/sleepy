import type { DraftCategory, SleeperDraftMetadata, SleeperDraftPick } from "./mock-drafts.types";

const SCORING_TYPE_LABELS: Record<SleeperDraftMetadata['metadata']['scoring_type'], string> = {
    standard: 'Standard',
    half_ppr: 'Half PPR',
    ppr: 'PPR',
};

export const formatDraftCategoryLabel = (category: DraftCategory): string => {
    const [scoringType, teams, slotsQb, slotsWr] = category.split('-');
    const scoringLabel = SCORING_TYPE_LABELS[scoringType as SleeperDraftMetadata['metadata']['scoring_type']] ?? scoringType;
    const wrCount = Number(slotsWr);
    const wrLabel = `${slotsWr}WR${wrCount > 1 ? 's' : ''}`;
    return `${scoringLabel}, ${teams} team, ${slotsQb}QB, ${wrLabel}`;
};

export const formatOrdinalPick = (pickNumber: number): string => {
    const mod100 = pickNumber % 100;
    const suffix = mod100 >= 11 && mod100 <= 13
        ? 'th'
        : pickNumber % 10 === 1
            ? 'st'
            : pickNumber % 10 === 2
                ? 'nd'
                : pickNumber % 10 === 3
                    ? 'rd'
                    : 'th';
    return `${pickNumber}${suffix} pick`;
};

export const getUserDraftSlot = (draftMetadata: SleeperDraftMetadata, sleeperUserId: string): number | undefined =>
    draftMetadata.draft_order?.[sleeperUserId];

export const getUserPicks = (picks: SleeperDraftPick[], sleeperUserId: string): SleeperDraftPick[] =>
    picks
        .filter(pick => pick.picked_by === sleeperUserId)
        .sort((a, b) => a.pick_no - b.pick_no);

const extractDraftCategory = (draftMetadata: SleeperDraftMetadata | undefined): DraftCategory | undefined => {
    if (!draftMetadata) return draftMetadata;
    return `${draftMetadata.metadata.scoring_type}-${draftMetadata.settings.teams}-${draftMetadata.settings.slots_qb}-${draftMetadata.settings.slots_wr}`
}

export const categorizeMockDraftsByDraftType = (drafts: Record<string, {
    metadata: SleeperDraftMetadata | undefined;
    picks: SleeperDraftPick[];
}> | undefined) => {
    if (!drafts) return {};

    const mockDraftsByCategory: Record<DraftCategory, {
        metadata: SleeperDraftMetadata;
        picks: SleeperDraftPick[];
    }[]> = {};
    for (let draft of Object.values(drafts)) {
        const draftCategory = extractDraftCategory(draft.metadata);
        if (draftCategory && draft.metadata) {
            const {metadata, picks} = draft;
            const existing = mockDraftsByCategory[draftCategory];
            if (existing) {
                existing.push({metadata, picks});
            } else {
                mockDraftsByCategory[draftCategory] = [{metadata, picks}]
            }
        }
    }
    return mockDraftsByCategory;
}