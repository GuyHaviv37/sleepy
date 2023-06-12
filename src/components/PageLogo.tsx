import React from 'react';

interface PageLogoProps {
    title: string;
}
const PageLogo = (props: PageLogoProps) => {
    return (
        <h3 className='text-xl md:text-2xl text-primary-text font-bold absolute top-5 left-3'>
            {props.title}
        </h3>
    )
}

export default React.memo(PageLogo);
