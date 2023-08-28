import React from 'react';

interface TooltipProps {
    TooltipComponent: JSX.Element;
    children: React.ReactNode;
}

const Tooltip = ({ TooltipComponent, children }: TooltipProps) => {
    return (
        <div className="group relative flex z-50">
            {children}
            <span className="absolute left-7 opacity-0 transition-all ease-in-out group-hover:opacity-100">{TooltipComponent}</span>
        </div>
    )
}

export default Tooltip;
