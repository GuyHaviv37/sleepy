import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';

const SPORT = 'nfl';
const SEASON = '2021'; // @TODO: turn to 2022

type LeagueData = {
    name: string;
    league_id: string;
}

type UseSleeperUserLeaguesResult = {
    leagues: LeagueData[],
    isLoading: boolean,
    isError: boolean
}

const useSleeperUserLeagues = (sleeperId: string): UseSleeperUserLeaguesResult => {
    const {data, error} = useSWR(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`, fetcher);

    return {
        leagues: data,
        isLoading: !error && !data,
        isError: error,
    }
}

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const {isLoading, leagues} = useSleeperUserLeagues(id as string);

    console.log('useSleeperUserLeagues', isLoading, leagues);

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
                    {isLoading ? <div>Loading...</div> : (
                        <div>
                            Leagues:
                            {leagues.map((league) => <div key={league.league_id}>{league.name}</div>)}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
};

export default UserDashboardPage;
