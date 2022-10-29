import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { getLocalStorageData, updateLocalStorageData } from '@/utils/localStorage';
import type {LeagueIgnoresMap, LeagueWeightsMap} from '@/utils/localStorage';
import { SPORT, SEASON } from '@/utils/consts';
import Link from 'next/link';
import Loader from '@/components/Loader';

type LeagueData = {
    name: string;
    league_id: string;
}

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
    const [leagueIgnoresMap, setLeagueIgnoresMap] = useState<LeagueIgnoresMap>({});

    useEffect(() => {
        const cachedLeagueWeights = getLocalStorageData('user')?.leagueWeights;
        const cachedLeagueIgnores = getLocalStorageData('user')?.leagueIgnores;
        if (cachedLeagueWeights) {
            setLeagueWeightsMap(cachedLeagueWeights);
        }
        if (cachedLeagueIgnores) {
            setLeagueIgnoresMap(cachedLeagueIgnores)
        }
    }, [])

    useEffect(() => {
        const defaultLeagueWeights: LeagueWeightsMap = {};
        const defaultLeagueIgnores: LeagueIgnoresMap = {};
        leagues?.forEach((league) => {
            if (!leagueWeightsMap[league.league_id]) {
                defaultLeagueWeights[league.league_id] = 0;
            }
            if (leagueIgnoresMap[league.league_id] === undefined) {
                defaultLeagueIgnores[league.league_id] = true;
            }
        })
        setLeagueWeightsMap((currentMap) => {
            return {
                ...defaultLeagueWeights,
                ...currentMap,
            }
        })
        setLeagueIgnoresMap((currentMap) => {
            return {
                ...defaultLeagueIgnores,
                ...currentMap,
            }
        })
    }, [leagues])


    const submitWeightsHandler = () => {
        const leagueNames = leagues.reduce((acc,league) => ({...acc, [league.league_id]: league.name}), {});
        const updatedData = updateLocalStorageData('user', {leagueWeights: leagueWeightsMap, leagueIgnores: leagueIgnoresMap, leagueNames});
        if (!updatedData) {
            console.error('Error: failed to update cached user data');
        } else {
            router.replace(`/user/${id}`)
        }
    };

    return (
        <>
            <Head>
                <title>Sleepy - Settings</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
                <section className='bg-primary w-4/5 min-w-min rounded-lg py-4'>
                    <div className='flex justify-between px-4'>
                        <h3 className='text-primary-text text-xl tracking-wider leading-relaxed'>
                            &#x2699; Settings (WIP)
                        </h3>
                        <Link href={`/user/${id}`}>
                            <button className="text-primary-text text-xl lg:text-2xl">&times;</button>
                        </Link>
                    </div>
                    <br/>
                    {isLoading ? <Loader/> : (
                        <div className="flex flex-col center-items">
                            <h5 className="text-primary-text text-lg px-6 sm:text-center underline">Your Leagues:</h5>
                            <div className="px-2 mb-3 max-h-96 overflow-y-auto md:self-center">
                                {leagues.map((league) => (
                                    <LeagueWeightInput
                                    key={league.league_id}
                                    leagueName={league.name}
                                    weightValue={leagueWeightsMap[league.league_id] ?? 0}
                                    onWeightValueHandler={(event: ChangeEvent<HTMLInputElement>) => setLeagueWeightsMap((currentMap) => {
                                        return {
                                            ...currentMap,
                                            [league.league_id]: parseInt(event.target.value),
                                        }
                                    })}
                                    onCheckboxTickHandler={(event: ChangeEvent<HTMLInputElement>) => setLeagueIgnoresMap((currentMap) => {
                                        return {
                                            ...currentMap,
                                            [league.league_id]: event.target.checked,
                                        }
                                    })}
                                    checkboxValue={leagueIgnoresMap[league.league_id] ?? true}
                                    />
                                    ))}
                            </div>
                            <button className="text-primary-text rounded-md bg-accent mx-auto px-3 py-1
                            hover:-translate-y-1 active:translate-y-0"
                            onClick={submitWeightsHandler}>
                                Submit
                            </button>
                            {fromLogin && <button className="px-1 mt-2 text-accent text-xs tracking-wide md:text-base"
                                onClick={submitWeightsHandler}>
                                or skip for later
                            </button>}
                        </div>
                    )}
                <p className='text-primary-text text-xs px-6 mt-3 font-thin max-w-sm mx-auto lg:text-sm'>
                    <span className='font-semibold'>You can ignore a league by unticking it&apos; checkbox.</span>
                    <br/>
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
    weightValue?: number;
    checkboxValue?: boolean;
    onWeightValueHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    onCheckboxTickHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const {leagueName, onWeightValueHandler, onCheckboxTickHandler, weightValue, checkboxValue} = props;

    return (
        <div className="flex justify-between mt-3 sm:space-x-5">
            <input type='checkbox' checked={checkboxValue} onChange={onCheckboxTickHandler}/>
            <p className="text-primary-text">{leagueName}</p>
            <div className="flex space-x-3">
                <input type="number" onChange={onWeightValueHandler}
                step={1} min={0} value={weightValue}
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
