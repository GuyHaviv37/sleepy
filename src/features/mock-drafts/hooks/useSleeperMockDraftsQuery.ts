import { trpc } from "@/utils/trpc"

export const useSleeperMockDraftsQuery = (mockDraftIds: string[]) => {
    const {data: drafts, isLoading, isError} = trpc.useQuery(['sleeper-api.getMockDraftsData', {mockDraftIds}])

    return {drafts, isLoading, isError}
}