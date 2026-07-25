import { fetcher } from "@/utils/fetcher"
import type { SleeperDraftPick, SleeperDraftMetadata } from "./mock-drafts.types";

const getMockDraftsPicksData = async (mockDraftIds: string[]): Promise<SleeperDraftPick[][]> => {
    const draftPicksPromises = mockDraftIds.map(mockDraftId => fetcher(`https://api.sleeper.app/v1/draft/${mockDraftId}/picks`));
    const draftPicks = await Promise.all(draftPicksPromises);
    return draftPicks;
}

const getMockDraftsData = async (mockDraftIds: string[]): Promise<SleeperDraftMetadata[]> => {
    const draftsPromises = mockDraftIds.map(mockDraftId => fetcher(`https://api.sleeper.app/v1/draft/${mockDraftId}`));
    const drafts = await Promise.all(draftsPromises);
    return drafts;
}

export const getMockDrafts = async (mockDraftIds: string[]) => {
    const [drafts, draftPicks] = await Promise.all([getMockDraftsData(mockDraftIds), getMockDraftsPicksData(mockDraftIds)]);
    return mockDraftIds.reduce((acc, mockDraftId, index) => {
        return {
            ...acc,
            [mockDraftId]: {
                metadata: drafts[index],
                picks: draftPicks[index] ?? [],
            }
        }
    }, {} as Record<string, {metadata: SleeperDraftMetadata | undefined, picks: SleeperDraftPick[]}>);
}