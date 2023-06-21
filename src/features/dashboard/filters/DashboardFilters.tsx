import React, { useState } from 'react';
import DashboardDropdown from './DashboardDropdown';
import { DashboardViewType, DashboardViewTypes, WEEKS } from '@/utils/consts';
import DashboardDropdownItem from './DashboardDropdownItem';

interface DashboardFiltersProps {
    selectedWeek: WEEKS;
    setSelectedWeek: React.Dispatch<React.SetStateAction<WEEKS>>;
    dashboardViewType: DashboardViewType;
    setDashboardViewType: React.Dispatch<React.SetStateAction<DashboardViewType>>;
}

const DashboardFilters = (props: DashboardFiltersProps) => {
    const { selectedWeek, setSelectedWeek, dashboardViewType, setDashboardViewType } = props;
    const [isWeeksDropdownOpen, setIsWeeksDropdownOpen] = useState(false);
    const [isDashboardViewDropdownOpen, setIsDashboardViewDropdownOpen] = useState(false);

    const onWeekOptionClick = (week: WEEKS) => {
        setSelectedWeek(week);
        setIsWeeksDropdownOpen(false);
    }

    const onViewTypeOptionClick = (viewType: DashboardViewType) => {
        setDashboardViewType(viewType);
        setIsDashboardViewDropdownOpen(false);
    }

    return (
        <div className='w-full flex flex-start flex-col my-3'>
            <h5 className='text-primary-text text-lg font-semibold mb-2'>Your Week</h5>
            <div className='flex gap-3 text-primary-text'>
                <DashboardDropdown
                    isOpen={isWeeksDropdownOpen}
                    placeholder='Choose a week'
                    toggleDropdown={() => setIsWeeksDropdownOpen(v => !v)}
                    currentValue={`Week ${selectedWeek}`} >
                    <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown">
                        {Object.values(WEEKS).map(week =>
                            <DashboardDropdownItem key={week} label={`Week ${week}`} onClick={() => onWeekOptionClick(week)} isSelected={week === selectedWeek} />)}
                    </ul>
                </DashboardDropdown>
                <DashboardDropdown
                    isOpen={isDashboardViewDropdownOpen}
                    placeholder='Choose a view'
                    toggleDropdown={() => setIsDashboardViewDropdownOpen(v => !v)}
                    currentValue={`${dashboardViewType}`} >
                    <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown">
                        {Object.values(DashboardViewTypes).map(viewType =>
                            <DashboardDropdownItem key={viewType} label={`${viewType}`} onClick={() => onViewTypeOptionClick(viewType)} isSelected={viewType === dashboardViewType} />)}
                    </ul>
                </DashboardDropdown>
            </div>
        </div>
    )
};

export default DashboardFilters;
