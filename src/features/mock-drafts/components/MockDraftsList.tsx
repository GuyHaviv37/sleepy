import { useEffect, useMemo, useState } from "react";
import type { DraftCategory } from "../mock-drafts.types";
import type { DraftOrderFilter, CategoryDraft } from "../extractors";
import {
    formatDraftCategoryLabel,
    formatOrdinalPick,
    getDraftOrdersInCategory,
    groupDraftsByDraftOrder,
} from "../extractors";
import MockDraftCategoryDropdown from "./MockDraftCategoryDropdown";
import MockDraftOrderDropdown from "./MockDraftOrderDropdown";
import MockDraftsGrid from "./MockDraftsGrid";

interface MockDraftsListProps {
    mockDraftsByCategory: Record<DraftCategory, CategoryDraft[]>;
    sleeperUserId: string;
}

const MockDraftsList = ({ mockDraftsByCategory, sleeperUserId }: MockDraftsListProps) => {
    const categories = Object.keys(mockDraftsByCategory) as DraftCategory[];
    const [selectedCategory, setSelectedCategory] = useState<DraftCategory>(() => categories[0]!);
    const [selectedDraftOrder, setSelectedDraftOrder] = useState<DraftOrderFilter>('all');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isDraftOrderDropdownOpen, setIsDraftOrderDropdownOpen] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !categories.includes(selectedCategory)) {
            setSelectedCategory(categories[0]!);
        }
    }, [categories, selectedCategory]);

    useEffect(() => {
        setSelectedDraftOrder('all');
    }, [selectedCategory]);

    const draftsInCategory = mockDraftsByCategory[selectedCategory] ?? [];
    const draftOrdersInCategory = useMemo(
        () => getDraftOrdersInCategory(draftsInCategory, sleeperUserId),
        [draftsInCategory, sleeperUserId],
    );

    const draftGroups = useMemo(
        () => groupDraftsByDraftOrder(draftsInCategory, sleeperUserId, selectedDraftOrder),
        [draftsInCategory, sleeperUserId, selectedDraftOrder],
    );

    if (categories.length === 0) return null;

    const showDraftOrderHeaders = selectedDraftOrder === 'all';

    return (
        <section className="flex flex-col w-full space-y-4">
            <div className="flex flex-col gap-3 w-full max-w-2xl">
                <div className="w-full max-w-xs md:max-w-sm">
                    <MockDraftCategoryDropdown
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        isOpen={isCategoryDropdownOpen}
                        toggleDropdown={() => setIsCategoryDropdownOpen(open => !open)}
                    />
                </div>
                <div className="w-full max-w-xs md:max-w-sm">
                    <MockDraftOrderDropdown
                        draftOrders={draftOrdersInCategory}
                        selectedDraftOrder={selectedDraftOrder}
                        onSelectDraftOrder={setSelectedDraftOrder}
                        isOpen={isDraftOrderDropdownOpen}
                        toggleDropdown={() => setIsDraftOrderDropdownOpen(open => !open)}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-6">
                {draftGroups.map(({ draftOrder, drafts }) => (
                    <div key={draftOrder ?? 'unknown'} className="flex flex-col space-y-2">
                        {showDraftOrderHeaders && (
                            <p className="text-gray-400 text-xs md:text-sm text-center tracking-wide">
                                {draftOrder ? formatOrdinalPick(draftOrder) : 'Draft slot unknown'}
                            </p>
                        )}
                        <MockDraftsGrid drafts={drafts} sleeperUserId={sleeperUserId} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MockDraftsList;
