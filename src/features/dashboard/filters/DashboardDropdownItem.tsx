import React from 'react';

interface DashboardDropdownItem {
    label: string;
    onClick: () => void;
    isSelected: boolean;
}

const DashboardDropdownItem = (props: DashboardDropdownItem) => {
    const { label, onClick, isSelected } = props;
    return (
        <li>
            <a onClick={onClick} className={`text-sm text-primary-text block px-4 py-2 hover:bg-secondary-accent
            ${isSelected ? 'bg-secondary-accent' : 'bg-accent'}`}>{label}</a>
        </li>
    )
}

export default DashboardDropdownItem;
