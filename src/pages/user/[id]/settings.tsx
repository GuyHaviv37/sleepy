import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { getLocalStorageData, updateLocalStorageData } from '@/utils/localStorage';

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
    const { id } = router.query;
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
    }, [leagues])


    const submitWeightsHandler = () => {
        const updatedData = updateLocalStorageData('user', {leagueWeights: leagueWeightsMap});
        if (!updatedData) {
            console.error('Error: failed to update user data');
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
                                    value={leagueWeightsMap[league.league_id]}
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
                        </div>
                    )}
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
        <div className="flex justify-between mt-3">
            <p className="text-primary-text">{leagueName}</p>
            <input type="number" onChange={onValueHandler}
            step={1} min={0} value={value}
            className="max-w-[50px] h-full text-center"/>
        </div>
    )
}

export default UserDashboardPage;
