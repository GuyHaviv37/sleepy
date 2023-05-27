import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetcher } from '@/utils/fetcher';
import Loader from '@/components/Loader';
import { WEEKS } from '@/utils/consts';
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
import { ViewTypePicker, WeeksNavbar } from '@/features/dashboard/DashboardFilters';

const UserDashboardPage = (props: {nflWeek: WEEKS}) => {
    const router = useRouter();
    const { id } = router.query;
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(props.nflWeek);
    const {data: cachedSettings} = useGetLocalStorage('settings');
    const {leagueRosterIds, isLeagueRosterIdsLoading} = useSleeperUserRosterIds(id as string);
    const {matchups, isMatchupsLoading} = useSleeperUserMatchupsData(selectedWeek, leagueRosterIds, cachedSettings?.leagueIgnoresMap);
    const {userStarters, oppStarters} = matchups ?? {};
    const {data: scheduleData, isLoading: isScheduleLoading} = useQuery({
        queryKey: ['nfl-schedule'],
        queryFn: () => getScheduleData(selectedWeek)
    })
    const [isByGameViewMode, setIsByGameViewMode] = useState(false);
    const { data: playersInfo, isLoading: isPlayersInfoLoading } = trpc.useQuery(
        ['players.getPlayersInfoByIds',
        { playerIds: [...Object.keys(userStarters ?? {}), ...Object.keys(oppStarters ?? {})] }]);
        
        const getSelectedWeekHandler = (week: WEEKS) => {
            return () => setSelectedWeek(week);
        }
        
        useEffect(() => {
            if (id && cachedSettings && !cachedSettings.leagueWeightsMap) {
                router.replace(`/user/${id}/settings`);
            }
        }, [cachedSettings, id, router]);
        
    const isLoading = isScheduleLoading || isMatchupsLoading || isLeagueRosterIdsLoading || isPlayersInfoLoading;
    return (
        <>
            <AppHeader title={'Sleepy - Board'}/>
            <main className="container mx-auto flex flex-col items-center justify-center p-4 bg-background-main">
                <Link href="/">
                    <h2 className="text-primary text-2xl mb-4 font-bold tracking-wide sm:text-3xl md:text-4xl cursor-pointer">Sleepy</h2>
                </Link>
                <section className="bg-primary w-full rounded-lg py-4 flex flex-col">
                    <div className="flex justify-between">
                        <div className="ml-4">
                            <ViewTypePicker
                                isByGameViewMode={isByGameViewMode}
                                setIsByGameViewMode={setIsByGameViewMode}
                            />
                        </div>
                        <Link href={`/user/${id}/settings`}>
                            <button className="self-end pr-3 md:pr-6 md:text-lg">&#x2699; <span className="text-primary-text hidden md:inline-block">Settings</span></button>
                        </Link>
                    </div>
                    <>
                        <WeeksNavbar getSelectedWeekHandler={getSelectedWeekHandler} selectedWeek={selectedWeek}/>
                        <div className='flex justify-between w-full px-3 sm:justify-center sm:space-x-6 text-primary-text mt-3 md:text-lg'>
                            <p>⚡ Super root</p>
                            <p>👎 Super &quot;boo&quot;</p>
                            <p>⚔ Conflicted</p>
                        </div>
                        {/* Missing players notice should also be in context */}
                        <DashboardContext.Provider value={{
                            playersInfo: playersInfo!,
                            scheduleData: scheduleData!,
                            userLeagueInfo: userStarters!,
                            oppLeagueInfo: oppStarters!
                        }}>
                            {!isLoading && <MissingPlayersNotice/>}
                            {isLoading ? (
                                <div className='pt-5'>
                                    <Loader/>
                                </div>
                            ) : (
                                <Dashboard
                                    isByGameViewMode={isByGameViewMode}
                                />
                            )}
                        </DashboardContext.Provider>
                    </>
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