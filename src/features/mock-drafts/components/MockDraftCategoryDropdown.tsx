import DashboardDropdown from "@/features/dashboard/filters/DashboardDropdown";
import DashboardDropdownItem from "@/features/dashboard/filters/DashboardDropdownItem";
import type { DraftCategory } from "../mock-drafts.types";
import { formatDraftCategoryLabel } from "../extractors";

interface MockDraftCategoryDropdownProps {
    categories: DraftCategory[];
    selectedCategory: DraftCategory;
    onSelectCategory: (category: DraftCategory) => void;
    isOpen: boolean;
    toggleDropdown: () => void;
}

const MockDraftCategoryDropdown = ({
    categories,
    selectedCategory,
    onSelectCategory,
    isOpen,
    toggleDropdown,
}: MockDraftCategoryDropdownProps) => {
    return (
        <DashboardDropdown
            isOpen={isOpen}
            placeholder="Draft type"
            toggleDropdown={toggleDropdown}
            currentValue={formatDraftCategoryLabel(selectedCategory)}
        >
            <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown_category">
                {categories.map(category => (
                    <DashboardDropdownItem
                        key={category}
                        label={formatDraftCategoryLabel(category)}
                        isSelected={category === selectedCategory}
                        onClick={() => {
                            onSelectCategory(category);
                            toggleDropdown();
                        }}
                    />
                ))}
            </ul>
        </DashboardDropdown>
    );
};

export default MockDraftCategoryDropdown;
