import React from 'react';

interface PageLogoProps {
    title: string;
}
const PageLogo = (({ title }: PageLogoProps) => {
    return (
        <span className='text-xl md:text-2xl text-primary-text font-bold absolute top-5 left-3'>
            {title}
        </span>
    )
});


export default React.memo(PageLogo);
