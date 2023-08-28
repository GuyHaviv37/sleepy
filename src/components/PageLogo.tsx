import React from 'react';

interface PageLogoProps {
    title: string;
    href?: string;
    onClick?: () => void;
}
const PageLogo = React.forwardRef<HTMLAnchorElement, PageLogoProps>(({ title, href, onClick }, ref) => {
    return (
        <a className='text-xl md:text-2xl text-primary-text font-bold absolute top-5 left-3'
            ref={ref} onClick={onClick} href={href}>
            {title}
        </a>
    )
});

PageLogo.displayName = 'PageLogo';

export default React.memo(PageLogo);
