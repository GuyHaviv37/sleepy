import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { getLocalStorageData, updateLocalStorageData } from '@/utils/localStorage';
import Link from 'next/link';

const SPORT = 'nfl';
const SEASON = '2021'; // @TODO: turn to 2022

type LeagueData = {
    name: string;
    league_id: string;
}

type LeagueWeightsMap = {[key: string]: number};

type UseSleeperUserLeaguesResult = {
    leagues: LeagueData[],
    isLoading: boolean,
    isError: boolean,
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
    const { id, fromLogin } = router.query;
    const {isLoading, leagues} = useSleeperUserLeagues(id as string);
    const [leagueWeightsMap, setLeagueWeightsMap] = useState<LeagueWeightsMap>({});

    useEffect(() => {
        const cachedLeagueWeights = getLocalStorageData('user')?.leagueWeights;
        console.log('cachedLeagueWeights', cachedLeagueWeights)
        if (cachedLeagueWeights) {
            setLeagueWeightsMap(cachedLeagueWeights);
        }
    }, [])

    useEffect(() => {
        const defaultLeagueWeights: LeagueWeightsMap = {};
        leagues?.forEach((league) => {
            if (!leagueWeightsMap[league.league_id]) {
                defaultLeagueWeights[league.league_id] = 0;
            }
        })
        setLeagueWeightsMap((currentMap) => {
            return {
                ...currentMap,
                ...defaultLeagueWeights,
            }
        })
    }, [leagues, leagueWeightsMap])


    const submitWeightsHandler = () => {
        const updatedData = updateLocalStorageData('user', {leagueWeights: leagueWeightsMap});
        if (!updatedData) {
            console.error('Error: failed to update user data');
        } else {
            router.replace(`/user/${id}`)
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
                    <div className='flex justify-between px-4'>
                        <h3 className='text-primary-text text-xl tracking-wider leading-relaxed'>
                            &#x2699; Settings
                        </h3>
                        <Link href={`/user/${id}`}>
                            <button className="text-primary-text text-xl lg:text-2xl">&times;</button>
                        </Link>
                    </div>
                    <br/>
                    {isLoading ? <div>Loading...</div> : (
                        <div className="flex flex-col center-items">
                            <h5 className="text-primary-text text-lg px-6 sm:text-center underline">Your Leagues:</h5>
                            <div className="px-2 mb-3">
                                {leagues.map((league, index) => (
                                    <LeagueWeightInput
                                    key={league.league_id}
                                    leagueName={league.name}
                                    value={leagueWeightsMap[league.league_id] ?? 0}
                                    onValueHandler={(event: ChangeEvent<HTMLInputElement>) => setLeagueWeightsMap((currentMap) => {
                                        return {
                                            ...currentMap,
                                            [league.league_id]: parseInt(event.target.value),
                                        }
                                    })}
                                    />
                                    ))}
                            </div>
                            {/* enables only when user db mutation is set */}
                            <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
                            hover:-translate-y-1 active:translate-y-0"
                            onClick={submitWeightsHandler}>
                                Submit
                            </button>
                            <button className="px-1 mt-2 text-accent text-xs tracking-wide md:text-base"
                                onClick={submitWeightsHandler}>
                                or skip for later
                            </button>
                        </div>
                    )}
                <p className='text-primary-text text-xs px-6 mt-3 font-thin max-w-sm mx-auto lg:text-sm'>
                    Here you can enter your leagues entry fees, this will be used
                    to scale better who you should root for and against.
                </p>
                </section>
            </main>
        </>
    )
};

interface LeagueWeightInputProps {
    leagueName: string;
    value?: number;
    onValueHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const {leagueName, onValueHandler, value} = props;

    return (
        <div className="flex justify-between mt-3 sm:justify-center sm:space-x-5">
            <p className="text-primary-text">{leagueName}</p>
            <div className="flex space-x-3">
                <input type="number" onChange={onValueHandler}
                step={1} min={0} value={value}
                className="max-w-[50px] h-full text-center rounded-lg text-grey-700
                border-[3px] border-solid border-grey-300
                transition ease-in-out
                focus:text-primary focus:border-accent focus:outline-none
                md:text-md"
                />
                <p className="text-green-500">$</p>
            </div>
        </div>
    )
}

export default UserDashboardPage;
