import { useState } from "react";
import { useRouter } from "next/router";
import AppHeader from "@/components/layout/AppHeader";
import PageLogo from "@/components/PageLogo";
import Loader from "@/components/Loader";
import { useGetLocalStorage } from "@/features/local-storage/hooks";
import { patchLocalStorageData, setLocalStorageData } from "@/features/local-storage/local-storage";
import AddMockDraftForm from "@/features/mock-drafts/components/AddMockDraftForm";
import AddMockDraftModal from "@/features/mock-drafts/components/AddMockDraftModal";
import MockDraftsList from "@/features/mock-drafts/components/MockDraftsList";
import { categorizeMockDraftsByDraftType } from "@/features/mock-drafts/extractors";
import { useSleeperMockDraftsQuery } from "@/features/mock-drafts/hooks/useSleeperMockDraftsQuery";
import Link from "next/link";
import * as bi from '@/features/dashboard/bi';

const MockDraftsPage = () => {
    const router = useRouter();
    const sleeperUserId = router.query.id as string;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: mockDrafts, refetch: refetchMockDrafts } = useGetLocalStorage("mockDrafts");
    const mockDraftIds = Object.keys(mockDrafts ?? {});
    const { drafts, isLoading } = useSleeperMockDraftsQuery(mockDraftIds);
    const mockDraftsByCategory = categorizeMockDraftsByDraftType(drafts);
    const hasDrafts = Object.keys(mockDraftsByCategory).length > 0;

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
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <>
            <AppHeader title={'Sleepy - Mock Drafts'} />
            <Link href={`/user/${sleeperUserId}`} passHref >
                <PageLogo title={'🏈 Sleepy'} onClick={bi.logDashboardLinkClicked} />
            </Link>
            <main className={`flex flex-col p-4 pt-16 bg-primary w-full min-h-screen ${hasDrafts ? 'pb-8' : 'h-screen'}`}>

                <h1 className='text-primary-text text-3xl font-semibold text-left w-full'>🔮 Mock Drafts</h1>
                {hasDrafts && (
                    <button
                        type="button"
                        className="text-primary-text font-semibold bg-alt rounded-lg px-4 py-2 absolute top-5 right-4 md:right-8 text-sm md:text-base"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        + Add Mock Draft
                    </button>
                )}

                <div className={`flex flex-col w-full space-y-6 ${hasDrafts ? 'mt-8 md:mt-12 px-2 md:px-6' : 'px-6 py-4'}`}>
                    {!hasDrafts && (
                        <>
                            <div className="text-center space-y-2 max-w-lg mx-auto">
                                <p className="text-primary-text text-lg md:text-xl font-semibold">
                                    No mock drafts yet
                                </p>
                                <p className="text-gray-400 text-sm md:text-base">
                                    Add a Sleeper mock draft URL below to track your picks and compare drafts across formats.
                                </p>
                            </div>
                            {isLoading && mockDraftIds.length > 0 ? (
                                <Loader />
                            ) : (
                                <AddMockDraftForm onSubmit={addMockDraft} />
                            )}
                        </>
                    )}

                    {hasDrafts && (
                        <>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <MockDraftsList
                                    mockDraftsByCategory={mockDraftsByCategory}
                                    sleeperUserId={sleeperUserId}
                                />
                            )}
                        </>
                    )}
                </div>

                <AddMockDraftModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={addMockDraft}
                />
            </main>
        </>
    );
};

export default MockDraftsPage;
