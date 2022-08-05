import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getLocalStorageData } from '@/utils/localStorage';

// @TODO: unify this with settings page for LocalStorageData typings
type LeagueWeightsMap = {[key: string]: number};

type UserData = {
    sleeperId?: string;
    username?: string;
    leagueWeights?: LeagueWeightsMap
}

const useLocalStorageUserData = (sleeperId: string): UserData | undefined => {
    const [userData, setUserData] = useState<UserData>();
    useEffect(() => {
        const cachedUserData = getLocalStorageData('user');
        if (cachedUserData?.sleeperId === sleeperId) {
            setUserData(cachedUserData);
        }
    }, [sleeperId]);
    return userData;
};

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const userData = useLocalStorageUserData(id as string);

    useEffect(() => {
        if (id && userData && !userData.leagueWeights) {
            router.replace(`/user/${id}/settings`);
        }
    }, [userData, id]);
    return (
        <>
            <Head>
                <title>Sleeper Sunday Cheatsheet</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
                <h2 className="text-primary text-2xl mb-4 font-bold tracking-wide">Your Board</h2>
                <section className="bg-primary w-full rounded-lg py-4">
                    {!userData ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div>Weeks navbar</div>
                            <div>Basic vs Roots vs. Boos switch</div>
                            <div>Actual Data View</div>
                        </>
                    )}
                </section>
            </main>
        </>
    )
};

export default UserDashboardPage;