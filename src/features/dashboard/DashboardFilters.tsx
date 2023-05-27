import React, { useEffect, useRef } from 'react';

interface ViewTypePickerProps {
    isByGameViewMode: boolean;
    setIsByGameViewMode: (current: boolean) => void
}

export const ViewTypePicker = (props: ViewTypePickerProps) => {
    const {isByGameViewMode, setIsByGameViewMode} = props;
    const SELECTED_STYLE = 'bg-accent font-semibold text-primary-text';
    const UNSELECTED_STYLE = 'bg-slate-200';
    return (
        <ul className="flex space-x-2">
            <li
            className={`rounded px-1 cursor-pointer ${isByGameViewMode ? UNSELECTED_STYLE : SELECTED_STYLE}`}
            onClick={() => setIsByGameViewMode(false)}>Slim View</li>
            <li
            className={`rounded px-1 cursor-pointer ${isByGameViewMode ? SELECTED_STYLE : UNSELECTED_STYLE}`}
            onClick={() => setIsByGameViewMode(true)}>By Game</li>
        </ul>
    )
}

import { WEEKS } from '@/utils/consts';

interface WeeksNavbarProps {
    selectedWeek: WEEKS;
    getSelectedWeekHandler: (week: WEEKS) => () => void;
}

export const WeeksNavbar: React.FC<WeeksNavbarProps> = (props) => {
    const {selectedWeek, getSelectedWeekHandler} = props;

    return (
        <ul className="flex max-w-[90%] mx-auto overflow-y-auto  rounded-lg
        mt-3  space-x-0.5 bg-gray-600
        scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-primary-text">
            {Object.values(WEEKS).map((week) => {
                return (
                <WeeksNavbarItem
                    key={week}
                    isSelected={week === selectedWeek}
                    onSelectHandler={getSelectedWeekHandler(week)}
                    label={`Week ${week}`}
                />
                )
            })}
        </ul>
    )
};

interface WeeksNavbarItemProps {
    isSelected: boolean;
    onSelectHandler: () => void;
    label: string;
}

const WeeksNavbarItem: React.FC<WeeksNavbarItemProps> = (props) => {
    const {isSelected, onSelectHandler, label} = props;
    const itemRef = useRef<HTMLLIElement | null>(null);
    useEffect(() => {
        if (itemRef.current && isSelected) {
            itemRef.current.scrollIntoView({inline: 'center'});
        }
    })

    return (
        <li ref={itemRef} className={`text-primary-text text-sm min-w-fit p-1 md:text-base md:p-2
        ${isSelected ? 'bg-accent' : 'bg-alt'} hover:bg-accent transition ease-in-out cursor-pointer`} onClick={onSelectHandler}>
            {label}
        </li>
    )
}