import AppHeader from "@/components/layout/AppHeader";
import PageLogo from "@/components/PageLogo";
import { useGetLocalStorage } from "@/features/local-storage/hooks";
import { patchLocalStorageData, setLocalStorageData, updateLocalStorageData } from "@/features/local-storage/local-storage";
import { useSleeperMockDraftsQuery } from "@/features/mock-drafts/hooks/useSleeperMockDraftsQuery";

const MockDraftsPage = () => {
    const { data: mockDrafts, refetch: refetchMockDrafts } = useGetLocalStorage("mockDrafts");
    const { drafts } = useSleeperMockDraftsQuery(Object.keys(mockDrafts ?? {}));

    const addMockDraft = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const mockDraftUrl = formData.get("mockDraftUrl") as string;
        const mockDraftId = mockDraftUrl.split("/").pop(); //@TODO: use Regex for better parsing.
        if (mockDraftId) {
            if (!mockDrafts) {
                setLocalStorageData("mockDrafts", { [mockDraftId]: mockDraftUrl });
            } else {
                patchLocalStorageData("mockDrafts", {
                    ...mockDrafts,
                    [mockDraftId]: mockDraftUrl
                });
            }
            refetchMockDrafts();
        }
    }

    return (
        <>
            <AppHeader title={'Sleepy - Mock Drafts'} />
            <main className="flex flex-col items-center justify-center h-screen p-4 bg-primary">
                <PageLogo title={`⚙️ Mock Drafts`} />
                <div className="flex flex-col w-full px-6 py-4 space-y-4">
                    <p className='text-primary-text text-lg'>
                        Add the URL of your mock draft to the form below to save it for future use.
                    </p>
                    <form onSubmit={addMockDraft} className="flex flex-col space-y-3 bg-accent py-8 px-6 rounded-lg">
                        <input type="url" name="mockDraftUrl" placeholder="Enter the URL of the mock draft" />
                        <button type="submit" className="bg-alt text-primary-text px-4 py-2 rounded-lg">Add Mock Draft</button>
                    </form>
                    <ul>
                        {drafts?.map((draft) => {
                            return (
                                <li key={draft.draft_id} className="text-primary-text text-sm">{draft.start_time}</li>
                            )
                        })}
                    </ul>
                </div>
            </main>
        </>
    )
}

export default MockDraftsPage;