import React from 'react';
import Head from 'next/head';

interface AppHeaderProps {
    title: string;
}

const AppHeader = (props: AppHeaderProps) => {
    return (
        <Head>
            <title>{props.title}</title>
            <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

export default AppHeader;