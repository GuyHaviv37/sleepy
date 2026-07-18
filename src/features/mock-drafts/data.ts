import { fetcher } from "@/utils/fetcher"

type SleeperDraft = {
    start_time: number;
    draft_id: string;
}

export const getMockDraftsData = async (mockDraftIds: string[]): Promise<SleeperDraft[]> => {
    const draftsPromises = mockDraftIds.map(mockDraftId => fetcher(`https://api.sleeper.app/v1/draft/${mockDraftId}`));
    const drafts = await Promise.all(draftsPromises);
    return drafts;
}