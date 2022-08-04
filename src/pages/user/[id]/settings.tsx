import React, { ChangeEvent, useEffect, useRef } from 'react';
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

type LeagueScale = {
    leagueId: string;
    scale: number;
}

type UseSleeperUserLeaguesResult = {
    leagues: LeagueData[],
    isLoading: boolean,
    isError: boolean,
    leagueWeightsMap: React.MutableRefObject<{[key: string]: string;}>
}

const useSleeperUserLeagues = (sleeperId: string): UseSleeperUserLeaguesResult => {
    const {data, error} = useSWR(`https://api.sleeper.app/v1/user/${sleeperId}/leagues/${SPORT}/${SEASON}`, fetcher);
    const leagueWeightsMap = useRef<{[key: string]: string}>({});

    useEffect(() => {
        data?.forEach((league: LeagueData) => leagueWeightsMap.current[league.league_id] = leagueWeightsMap.current[league.league_id] ?? "0")
    }, [data]);

    return {
        leagues: data,
        isLoading: !error && !data,
        isError: error,
        leagueWeightsMap,
    }
}

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const {isLoading, leagues, leagueWeightsMap} = useSleeperUserLeagues(id as string);

    const submitWeightsHandler = () => {
        const leagueScales: LeagueScale[] = [];
        for (let i=0; i < leagues.length; i++) {
            const leagueId = leagues[i]?.league_id;
            if (!leagueId) continue;
            leagueScales.push({
                leagueId,
                scale: parseInt(leagueWeightsMap.current?.[leagueId] ?? '0'),
            })
        }
        console.log('leagueScales: ', leagueScales);
        if (typeof window !== 'undefined') {
            const cachedUserData = window.localStorage.getItem('user');
            if (cachedUserData) {
                const exisitingUserData = JSON.parse(cachedUserData); 
                window.localStorage.setItem('user', JSON.stringify({
                  ...exisitingUserData,
                  leagueScales: leagueScales
                }));
            } else {
                // Add re-login message to the user.
                console.error('No user data cached to update');
            }
          }
    };

    return (
        <>
            <Head>
                <title>Sleeper Sunday Cheatsheet</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
                <section className='bg-primary w-4/5 min-w-min rounded-lg py-4'>
                    <h3 className='text-primary-text text-xl tracking-wider leading-relaxed px-6'>&#x2699; Settings</h3>
                    <br/>
                    {isLoading ? <div>Loading...</div> : (
                        <div className="flex flex-col center-items">
                            <h5 className="text-primary-text text-lg px-6">Your Leagues:</h5>
                            <div className="px-2 mb-3">
                                <p className='text-green-500 text-right'>By $</p>
                                {leagues.map((league, index) => (
                                    <LeagueWeightInput
                                    key={league.league_id}
                                    leagueName={league.name}
                                    onValueHandler={(event: ChangeEvent<HTMLInputElement>) => leagueWeightsMap.current[league.league_id] = event.target.value}
                                    />
                                    ))}
                            </div>
                            {/* enables only when user db mutation is set */}
                            <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
                            hover:-translate-y-1 active:translate-y-0"
                            onClick={submitWeightsHandler}>
                                Submit
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
};

interface LeagueWeightInputProps {
    leagueName: string;
    onValueHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const {leagueName, onValueHandler} = props;

    return (
        <div className="flex justify-between mt-3">
            <p className="text-primary-text">{leagueName}</p>
            <input type="number" onChange={onValueHandler}
            defaultValue={0} step={1} min={0}
            className="max-w-[50px] h-full text-center"/>
        </div>
    )
}

export default UserDashboardPage;
