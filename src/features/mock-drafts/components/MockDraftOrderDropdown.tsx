import DashboardDropdown from "@/features/dashboard/filters/DashboardDropdown";
import DashboardDropdownItem from "@/features/dashboard/filters/DashboardDropdownItem";
import type { DraftOrderFilter } from "../extractors";
import { formatDraftOrderFilterLabel } from "../extractors";

interface MockDraftOrderDropdownProps {
    draftOrders: number[];
    selectedDraftOrder: DraftOrderFilter;
    onSelectDraftOrder: (draftOrder: DraftOrderFilter) => void;
    isOpen: boolean;
    toggleDropdown: () => void;
}

const MockDraftOrderDropdown = ({
    draftOrders,
    selectedDraftOrder,
    onSelectDraftOrder,
    isOpen,
    toggleDropdown,
}: MockDraftOrderDropdownProps) => {
    const options: DraftOrderFilter[] = ['all', ...draftOrders];

    return (
        <DashboardDropdown
            isOpen={isOpen}
            placeholder="Draft slot"
            toggleDropdown={toggleDropdown}
            currentValue={formatDraftOrderFilterLabel(selectedDraftOrder)}
        >
            <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown_draft_order">
                {options.map(option => (
                    <DashboardDropdownItem
                        key={option}
                        label={formatDraftOrderFilterLabel(option)}
                        isSelected={option === selectedDraftOrder}
                        onClick={() => {
                            onSelectDraftOrder(option);
                            toggleDropdown();
                        }}
                    />
                ))}
            </ul>
        </DashboardDropdown>
    );
};

export default MockDraftOrderDropdown;
