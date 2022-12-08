import { WEEKS } from '@/utils/consts';
import React, { useEffect, useRef } from 'react';

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
