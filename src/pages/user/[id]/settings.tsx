import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { safeUpdateLocalStorageData } from '@/features/local-storage/local-storage';
import type { LeagueIgnoresMap, LeagueWeightsMap } from '@/features/local-storage/local-storage';
import Link from 'next/link';
import { getSleeperUserLeagues } from '@/features/leagues/data';
import { useGetLocalStorage } from '@/features/local-storage/hooks';
import { CacheStatus } from '@/features/local-storage/local-storage.types';
import LeagueWeightInput from '@/features/settings/components/SettingsLeagueWeightInput';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SleeperLeagueData } from '@/features/leagues/leagues.types';

type UserDashboardPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserDashboardPage = ({ leagues }: UserDashboardPageProps) => {
    const router = useRouter();
    const { id, fromLogin } = router.query;
    const { data: cachedSettings, cacheStatus: cachedSettingsStatus } = useGetLocalStorage('settings');
    const [leagueWeightsMap, setLeagueWeightsMap] = useState<LeagueWeightsMap>({});
    const [leagueIgnoresMap, setLeagueIgnoresMap] = useState<LeagueIgnoresMap>({});
    const [shouldShowMissingStarters, setShouldShowMissingStarters] = useState<boolean>(true);
    useEffect(() => {
        if (cachedSettingsStatus === CacheStatus.HIT) {
            setLeagueWeightsMap(cachedSettings.leagueWeightsMap);
            setLeagueIgnoresMap(cachedSettings.leagueIgnoresMap);
            setShouldShowMissingStarters(cachedSettings.shouldShowMissingStarters);
        }
    }, [cachedSettingsStatus]);


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


    // move outside of component
    const submitWeightsHandler = () => {
        const leagueNames = leagues?.reduce((acc, league) => ({ ...acc, [league.league_id]: league.name }), {});
        const leagueStarterSpots = leagues?.reduce((acc, league) => {
            const starterSpotsInLeague = league.roster_positions.filter(position => position !== 'BN').length;
            return { ...acc, [league.league_id]: starterSpotsInLeague };
        }, {})
        safeUpdateLocalStorageData('settings', {
            shouldShowMissingStarters,
            leagueIgnoresMap,
            leagueWeightsMap
        });
        safeUpdateLocalStorageData('leaguesInfo', {
            leagueNames,
            leagueStarterSpots,
        });
        router.replace(`/user/${id}`);
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
                    <br />
                    <div className="flex flex-col center-items">
                        <h5 className="text-primary-text text-lg px-6 sm:text-center underline">Your Leagues:</h5>
                        <div className="px-2 mb-3 max-h-96 overflow-y-auto md:self-center">
                            {leagues?.map((league) => (
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
                            <div className='border-t-2 mt-3 border-text-primary-text' />
                            <div className='flex mt-3'>
                                <input type='checkbox' checked={shouldShowMissingStarters}
                                    onChange={e => setShouldShowMissingStarters(e.target.checked)} />
                                <p className="text-primary-text text-sm pl-5">Show missing starters notice</p>
                            </div>
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
                    <p className='text-primary-text text-xs px-6 mt-3 font-thin max-w-sm mx-auto lg:text-sm'>
                        <span className='font-semibold'>You can ignore a league by unticking it&apos; checkbox.</span>
                        <br />
                        Here you can enter your leagues entry fees, this will be used
                        to scale better who you should root for and against.
                    </p>
                </section>
            </main>
        </>
    )
};

export const getServerSideProps: GetServerSideProps<{ leagues: SleeperLeagueData[] }> = async (ctx) => {
    const sleeperUserId = ctx.params?.id;
    if (!sleeperUserId) return { props: { leagues: [] } };
    const leagues = await getSleeperUserLeagues(sleeperUserId as string);
    return { props: { leagues } };
}

export default UserDashboardPage;
