import { useEffect, useState } from "react";
import type { DraftCategory, SleeperDraftMetadata, SleeperDraftPick } from "../mock-drafts.types";
import { formatDraftCategoryLabel, formatOrdinalPick, getUserDraftSlot, getUserPicks } from "../extractors";
import MockDraftCategoryDropdown from "./MockDraftCategoryDropdown";
import MockDraftPickCell from "./MockDraftPickCell";

type CategoryDraft = {
    metadata: SleeperDraftMetadata;
    picks: SleeperDraftPick[];
};

interface MockDraftsListProps {
    mockDraftsByCategory: Record<DraftCategory, CategoryDraft[]>;
    sleeperUserId: string;
}

const MockDraftsList = ({ mockDraftsByCategory, sleeperUserId }: MockDraftsListProps) => {
    const categories = Object.keys(mockDraftsByCategory) as DraftCategory[];
    const [selectedCategory, setSelectedCategory] = useState<DraftCategory>(() => categories[0]!);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !categories.includes(selectedCategory)) {
            setSelectedCategory(categories[0]!);
        }
    }, [categories, selectedCategory]);

    if (categories.length === 0) return null;

    const draftsInCategory = mockDraftsByCategory[selectedCategory] ?? [];

    return (
        <section className="flex flex-col w-full space-y-4">
            <div className="w-full max-w-xs md:max-w-sm">
                <MockDraftCategoryDropdown
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    isOpen={isCategoryDropdownOpen}
                    toggleDropdown={() => setIsCategoryDropdownOpen(open => !open)}
                />
            </div>

            <div className="flex flex-col space-y-2">
                {draftsInCategory.map(draft => {
                    const userPicks = getUserPicks(draft.picks, sleeperUserId);
                    const draftSlot = getUserDraftSlot(draft.metadata, sleeperUserId);

                    return (
                        <div key={draft.metadata.draft_id} className="flex flex-col space-y-2">
                            <div className="w-full py-1">
                                <p className="text-gray-400 text-xs md:text-sm text-center tracking-wide">
                                    {draftSlot ? formatOrdinalPick(draftSlot) : 'Draft slot unknown'}
                                </p>
                            </div>

                            {userPicks.length > 0 ? (
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-secondary-accent scrollbar-track-accent pb-2">
                                    <div className="flex gap-2 min-w-min">
                                        {userPicks.map(pick => (
                                            <MockDraftPickCell key={pick.pick_no} pick={pick} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic px-1">
                                    No picks found for this user in this draft.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MockDraftsList;
