import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const SPORT = 'nfl';
const SEASON = '2021'; // @TODO: turn to 2022

type LeagueData = {
    name: string;
    league_id: string;
}

const getSleeperUserLeagues = async (sleeperId: string): Promise<LeagueData[]> => {
    return await (await fetch(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`)).json();
}

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [leagues, setLeagues] = useState<LeagueData[] | undefined>();

    useEffect(() => {
        const fetchLeagues = async () => {
            if (typeof id === 'string') {
                const fetchedLeagues = await getSleeperUserLeagues(id);
                console.log('fetchedLeagues', fetchedLeagues);
                setLeagues(fetchedLeagues);
            }
        }
        fetchLeagues();
    }, [id])

    return (
        <>
            <Head>
                <title>Sleeper Sunday Cheatsheet</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
                <section className='bg-primary w-4/5 min-w-min rounded-lg px-6 py-4'>
                    <h3 className='text-primary-text text-lg tracking-wider leading-relaxed'>&#x2699; Settings</h3>
                    {!leagues ? <div>Loading...</div> : (
                        <div>
                            Leagues:
                            {leagues.map((league) => <div>{league.name}</div>)}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
};

export default UserDashboardPage;
