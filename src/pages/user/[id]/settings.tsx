import React from 'react';
import { useRouter } from 'next/router';
import { safeUpdateLocalStorageData } from '@/features/local-storage/local-storage';
import Link from 'next/link';
import { getSleeperUserLeagues } from '@/features/leagues/data';
import LeagueWeightInput from '@/features/settings/components/SettingsLeagueWeightInput';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SleeperLeagueData } from '@/features/leagues/leagues.types';
import AppHeader from '@/components/layout/AppHeader';
import { useSettings } from '@/features/settings/useSettings';
import FlexibleContainer from '@/components/layout/FlexibleContainer';
import PageLogo from '@/components/PageLogo';

type UserDashboardPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserDashboardPage = ({ leagues }: UserDashboardPageProps) => {
    const router = useRouter();
    const { id, fromLogin } = router.query;
    const { leagueIgnoresMap, leagueWeightsMap, shouldShowMissingStarters,
        onChangeLeagueIgnore, onChangeLeagueWeight, onChangeShowMissingStarters } = useSettings(leagues);

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
            <AppHeader title={'Sleepy - Settings'} />
            <main className="flex flex-col items-center justify-center h-screen p-4 bg-primary">
                <PageLogo title={fromLogin ? '🏈 Sleepy' : `⚙️ Settings`} />
                {fromLogin ? null :
                    <Link href={`/user/${id}`}>
                        <button className="text-primary-text text-2xl lg:text-4xl absolute top-5 right-5">&times;</button>
                    </Link>}
                <FlexibleContainer>
                    <p className='text-primary-text text-2xl px-6 mt-3 mx-auto md:mx-0 lg:text-4xl md:w-1/2'>
                        Enter your leagues entry fees so you can scale better to who you should root for and against.
                        <br />
                        <span className='text-alt text-sm font-thin md:text-lg'>Ignore a league by unticking its checkbox</span>
                    </p>
                    <section className='flex flex-col space-y-3 bg-accent px-5 py-3 rounded-lg md:w-1/2 md:max-w-md'>
                        <h5 className='text-primary-text text-xl font-semibold tracking-wide md:text-2xl'>Your Leagues</h5>
                        <div className="flex flex-col center-items">
                            <div className="px-2 mb-3 max-h-96 overflow-y-auto md:self-center">
                                {leagues?.map((league) => (
                                    <LeagueWeightInput
                                        key={league.league_id}
                                        leagueName={league.name}
                                        weightValue={leagueWeightsMap[league.league_id] ?? 0}
                                        onWeightValueHandler={event => onChangeLeagueWeight(league.league_id, parseInt(event.target.value))}
                                        onCheckboxTickHandler={event => onChangeLeagueIgnore(league.league_id, event.target.checked)}
                                        checkboxValue={leagueIgnoresMap[league.league_id] ?? true}
                                    />
                                ))}
                                <div className='border-t-[1px] mt-3 border-alt' />
                                <div className='flex mt-3'>
                                    <input type='checkbox'
                                        id='missing_players_checkbox'
                                        className='w-4 checked:accent-alt rounded-lg md:w-5'
                                        checked={shouldShowMissingStarters}
                                        onChange={event => onChangeShowMissingStarters(event.target.checked)} />
                                    <label htmlFor='missing_players_checkbox'
                                        className="text-primary-text text-sm pl-5 md:text-base">Show missing starters notice</label>
                                </div>
                            </div>
                            <button className="text-primary-text rounded-lg bg-alt w-full py-3"
                                onClick={submitWeightsHandler}>
                                Submit
                            </button>
                            {fromLogin && <button className="px-1 mt-2 text-primary-text mx-auto text-sm tracking-wide md:text-base w-fit"
                                onClick={submitWeightsHandler}>
                                or skip for later
                            </button>}
                        </div>
                    </section>
                </FlexibleContainer>

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
