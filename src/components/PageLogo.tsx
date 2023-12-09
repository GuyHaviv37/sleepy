import React from 'react';

interface PageLogoProps {
    title: string;
    onClick?: () => void;
}
const PageLogo = React.forwardRef<HTMLAnchorElement, PageLogoProps>(({ title, onClick }, ref) => {
    return (
        <div className='text-xl md:text-2xl text-primary-text font-bold absolute top-5 left-3'
            onClick={onClick}>
            {title}
        </div>
    )
});

PageLogo.displayName = 'PageLogo';

export default React.memo(PageLogo);
