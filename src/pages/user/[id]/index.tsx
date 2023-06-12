import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetcher } from '@/utils/fetcher';
import Loader from '@/components/Loader';
import { DashboardViewType, DashboardViewTypes, WEEKS } from '@/utils/consts';
import MissingPlayersNotice from '@/features/missing-players/MissingPlayersNotice';
import { trpc } from '@/utils/trpc';
import AppHeader from '@/components/layout/AppHeader';
import { useGetLocalStorage } from '@/features/local-storage/hooks';
import { useSleeperUserRosterIds } from '@/features/user/hooks/useSleeperUserRosterIds';
import { useQuery } from 'react-query';
import { getScheduleData } from '@/features/schedule/data';
import { useSleeperUserMatchupsData } from '@/features/user/hooks/useSleeperUserMatchupsData';
import Dashboard from '@/features/dashboard/Dashboard';
import DashboardContext from '@/features/dashboard/DashboardContext';
import PageLogo from '@/components/PageLogo';
import DashboardFilters from '@/features/dashboard/filters/DashboardFilters';

const UserDashboardPage = (props: { nflWeek: WEEKS }) => {
    const router = useRouter();
    const { id } = router.query;
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(props.nflWeek);
    const { data: cachedSettings } = useGetLocalStorage('settings');
    const { data: cachedUserInfo } = useGetLocalStorage('user');
    const { leagueRosterIds, isLeagueRosterIdsLoading } = useSleeperUserRosterIds(id as string);
    const { matchups, isMatchupsLoading } = useSleeperUserMatchupsData(selectedWeek, leagueRosterIds, cachedSettings?.leagueIgnoresMap);
    const { userStarters, oppStarters } = matchups ?? {};
    const { data: scheduleData, isLoading: isScheduleLoading } = useQuery({
        queryKey: ['nfl-schedule'],
        queryFn: () => getScheduleData(selectedWeek)
    })
    const [dashboardViewType, setDashboardViewType] = useState<DashboardViewType>(DashboardViewTypes.SLIM);
    const { data: playersInfo, isLoading: isPlayersInfoLoading } = trpc.useQuery(
        ['players.getPlayersInfoByIds',
            { playerIds: [...Object.keys(userStarters ?? {}), ...Object.keys(oppStarters ?? {})] }]);

    useEffect(() => {
        if (id && cachedSettings && !cachedSettings.leagueWeightsMap) {
            router.replace(`/user/${id}/settings`);
        }
    }, [cachedSettings, id, router]);

    const isLoading = isScheduleLoading || isMatchupsLoading || isLeagueRosterIdsLoading || isPlayersInfoLoading;
    return (
        <>
            <AppHeader title={'Sleepy - Board'} />
            <main className="mx-auto flex flex-col items-center justify-center p-4 bg-primary">
                <Link href="/">
                    <PageLogo title={'🏈 Sleepy'} />
                </Link>
                <Link href={`/user/${id}/settings`}>
                    <button className='text-md text-primary-text font-semibold absolute top-5 right-5'>⚙️ Settings</button>
                </Link>
                {/* @TODO: remove color */}
                <div className='h-10 bg-red-500 w-full' />
                <h1 className='text-primary-text text-3xl text-semibold text-left w-full'>Hello, {cachedUserInfo?.username ?? 'Player'}</h1>
                {/* Highlighted players */}
                <DashboardFilters
                    selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek}
                    dashboardViewType={dashboardViewType} setDashboardViewType={setDashboardViewType}
                />
                <section className="w-full rounded-lg py-4 flex flex-col">
                    {isLoading ? (
                        <div className='pt-5'>
                            <Loader />
                        </div>
                    ) : (
                        <DashboardContext.Provider value={{
                            playersInfo: playersInfo!,
                            scheduleData: scheduleData!,
                            userLeagueInfo: userStarters!,
                            oppLeagueInfo: oppStarters!
                        }}>
                            {!isLoading && <MissingPlayersNotice />}
                            <Dashboard
                                isByGameViewMode={dashboardViewType === DashboardViewTypes.FULL}
                            />
                        </DashboardContext.Provider>
                    )}
                </section>
            </main>
        </>
    )
};



export default UserDashboardPage;

export const getServerSideProps = async () => {
    const nflWeekObj = await fetcher('https://api.sleeper.app/v1/state/nfl');
    const nflWeek = nflWeekObj.season_type === 'pre' || nflWeekObj.season_type === 'off' ? WEEKS.WEEK1 : `${nflWeekObj.display_week}` as WEEKS;
    return {
        props: {
            nflWeek
        }
    }
}