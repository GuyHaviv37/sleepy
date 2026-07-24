import type { DraftCategory, SleeperDraftMetadata, SleeperDraftPick } from "./mock-drafts.types";

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
            if (mockDraftsByCategory[draftCategory]) {
                mockDraftsByCategory[draftCategory].push({metadata, picks});
            } else {
                mockDraftsByCategory[draftCategory] = [{metadata, picks}]
            }
        }
    }
    return mockDraftsByCategory;
}