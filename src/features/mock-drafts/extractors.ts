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

export const getDraftOrdersInCategory = (
    drafts: { metadata: SleeperDraftMetadata }[],
    sleeperUserId: string,
): number[] => {
    const draftOrders = new Set<number>();
    for (const draft of drafts) {
        const draftSlot = getUserDraftSlot(draft.metadata, sleeperUserId);
        if (draftSlot !== undefined) {
            draftOrders.add(draftSlot);
        }
    }
    return Array.from(draftOrders).sort((a, b) => a - b);
};

export type DraftOrderFilter = 'all' | number;

export const formatDraftOrderFilterLabel = (filter: DraftOrderFilter): string =>
    filter === 'all' ? 'All Picks' : formatOrdinalPick(filter);

export type CategoryDraft = {
    metadata: SleeperDraftMetadata;
    picks: SleeperDraftPick[];
};

export type DraftOrderGroup = {
    draftOrder: number | undefined;
    drafts: CategoryDraft[];
};

export const groupDraftsByDraftOrder = (
    drafts: CategoryDraft[],
    sleeperUserId: string,
    draftOrderFilter: DraftOrderFilter = 'all',
): DraftOrderGroup[] => {
    const filteredDrafts = draftOrderFilter === 'all'
        ? drafts
        : drafts.filter(draft => getUserDraftSlot(draft.metadata, sleeperUserId) === draftOrderFilter);

    const groups = new Map<number | 'unknown', CategoryDraft[]>();
    for (const draft of filteredDrafts) {
        const draftSlot = getUserDraftSlot(draft.metadata, sleeperUserId);
        const groupKey = draftSlot ?? 'unknown';
        const existing = groups.get(groupKey) ?? [];
        existing.push(draft);
        groups.set(groupKey, existing);
    }

    const knownDraftOrders = Array.from(groups.keys())
        .filter((key): key is number => key !== 'unknown')
        .sort((a, b) => a - b);

    const draftOrderGroups: DraftOrderGroup[] = knownDraftOrders.map(draftOrder => ({
        draftOrder,
        drafts: groups.get(draftOrder)!,
    }));

    const unknownDrafts = groups.get('unknown');
    if (unknownDrafts) {
        draftOrderGroups.push({ draftOrder: undefined, drafts: unknownDrafts });
    }

    return draftOrderGroups;
};

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