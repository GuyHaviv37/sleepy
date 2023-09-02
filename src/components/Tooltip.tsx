import React from 'react';

interface TooltipProps {
    TooltipComponent: JSX.Element;
    children: React.ReactNode;
}

const Tooltip = ({ TooltipComponent, children }: TooltipProps) => {
    return (
        <div className="relative flex z-50">
            <div className="peer">{children}</div>
            <span className="absolute left-7 invisible opacity-0 transition-all ease-in-out peer-hover:visible peer-hover:opacity-100">{TooltipComponent}</span>
        </div>
    )
}

export default Tooltip;
