import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <>
            <Head>
                <title>Sleeper Sunday Cheatsheet</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                my user name is {id}
            </div>
        </>
    )
};

export default UserDashboardPage;
