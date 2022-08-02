import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { inferMutationInput, trpc } from '@/utils/trpc';

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

// type UpdateUserScalesInput = inferMutationInput<'example.updateUserScales'>;

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const {isLoading, leagues} = useSleeperUserLeagues(id as string);
    const inputRefs = useRef<HTMLInputElement[]>(new Array());
    const updateUserScales = trpc.useMutation('example.updateUserScales');

    console.log('input refs: ', inputRefs);

    const submitWeightsHandler = () => {
        console.log('input Refs: ', inputRefs.current);
        const leagueWeights: inferMutationInput<'example.updateUserScales'>['scales'] = [];
        for (let i=0; i < leagues.length; i++) {
            leagueWeights.push({
                leagueId: leagues[i]?.league_id ?? '',
                scale: parseInt(inputRefs.current[i]?.value ?? '0'),
            })
        }
        console.log('leagueWeights: ', leagueWeights);
        updateUserScales.mutate({scales: leagueWeights, sleeperId: id as string});
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
                                    onInputRef={(element: HTMLInputElement) => inputRefs.current[index] = element}
                                    />
                                    ))}
                            </div>
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
    onInputRef: (element: HTMLInputElement) => void;
}

const LeagueWeightInput: React.FC<LeagueWeightInputProps> = (props) => {
    const {leagueName, onInputRef} = props;

    return (
        <div className="flex justify-between mt-3">
            <p className="text-primary-text">{leagueName}</p>
            <input type="number" ref={onInputRef}
            defaultValue={0} step={1} min={0}
            className="max-w-[50px] h-full text-center"/>
        </div>
    )
}

export default UserDashboardPage;
