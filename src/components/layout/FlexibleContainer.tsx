import React from 'react';

const FlexibleContainer = (props: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col space-y-9 md:flex-row md:justify-center md:space-y-0 md:space-x-12 max-w-6xl">
            {props.children}
        </div>
    )
};

export default FlexibleContainer;