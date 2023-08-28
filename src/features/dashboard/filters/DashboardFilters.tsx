import React from 'react';
import DashboardDropdown from './DashboardDropdown';
import { DashboardViewType, DashboardViewTypes, WEEKS } from '@/utils/consts';
import DashboardDropdownItem from './DashboardDropdownItem';
import * as bi from './bi';

interface DashboardFiltersProps {
    selectedWeek: WEEKS;
    setSelectedWeek: React.Dispatch<React.SetStateAction<WEEKS>>;
    dashboardViewType: DashboardViewType;
    setDashboardViewType: React.Dispatch<React.SetStateAction<DashboardViewType>>;
    isWeeksDropdownOpen: boolean;
    setIsWeeksDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isDashboardViewDropdownOpen: boolean;
    setIsDashboardViewDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardFilters = (props: DashboardFiltersProps) => {
    const { selectedWeek, setSelectedWeek, dashboardViewType, setDashboardViewType,
        isWeeksDropdownOpen, setIsWeeksDropdownOpen, isDashboardViewDropdownOpen, setIsDashboardViewDropdownOpen } = props;

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
                    toggleDropdown={() => {
                        bi.logWeeksFilterClicked(!isWeeksDropdownOpen);
                        setIsWeeksDropdownOpen(v => !v)
                    }}
                    currentValue={`Week ${selectedWeek}`} >
                    <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown">
                        {Object.values(WEEKS).map(week =>
                            <DashboardDropdownItem key={week} label={`Week ${week}`} isSelected={week === selectedWeek}
                                onClick={() => {
                                    bi.logWeeksFilterItemClicked(week)
                                    onWeekOptionClick(week)
                                }
                                } />)}
                    </ul>
                </DashboardDropdown>
                <DashboardDropdown
                    isOpen={isDashboardViewDropdownOpen}
                    placeholder='Choose a view'
                    toggleDropdown={() => {
                        bi.logViewFilterClicked(!isDashboardViewDropdownOpen);
                        setIsDashboardViewDropdownOpen(v => !v)
                    }}
                    currentValue={`${dashboardViewType}`} >
                    <ul className="py-1 divide-y divide-secondary-accent" aria-labelledby="dropdown">
                        {Object.values(DashboardViewTypes).map(viewType =>
                            <DashboardDropdownItem key={viewType} label={`${viewType}`} isSelected={viewType === dashboardViewType}
                                onClick={() => {
                                    bi.logViewFilterItemClicked(viewType);
                                    onViewTypeOptionClick(viewType)
                                }} />)}
                    </ul>
                </DashboardDropdown>
            </div>
        </div>
    )
};

export default DashboardFilters;
