import React from 'react';

const FlexibleContainer = (props: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col space-y-9 md:flex-row md:justify-center md:space-y-0 md:space-x-9">
            {props.children}
        </div>
    )
};

export default FlexibleContainer;