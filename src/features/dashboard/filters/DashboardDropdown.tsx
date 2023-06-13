import React, { useState } from 'react';

interface DashboardDropdownProps {
    isOpen: boolean;
    placeholder: string;
    toggleDropdown: () => void;
    currentValue: string;
    children: React.ReactNode;
}

const DashboardDropdown: React.FC<DashboardDropdownProps> = (props) => {
    const { isOpen, toggleDropdown, currentValue, placeholder, children } = props;
    return (
        <div className='relative'>
            <button className="text-primary-text font-medium text-center
             bg-accent rounded-lg px-3 py-2
            focus:ring-2 focus:ring-alt inline-flex items-center gap-3" type="button" data-dropdown-toggle="dropdown"
                onClick={toggleDropdown}>
                <div className='flex flex-col w-full text-left'>
                    <p className='text-xs tracking-wide text-gray-400'>{placeholder}</p>
                    <p className='text-sm'>{currentValue}</p>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div className={`bg-accent text-base z-50 list-none rounded shadow my-2
            absolute w-full overflow-y-auto h-64 md:h-auto
            ${isOpen ? '' : 'hidden'}`} id="dropdown">
                {children}
            </div>
        </div>
    )
};

export default DashboardDropdown;
