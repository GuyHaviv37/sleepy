import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { LeagueRosterIdsMap, LeagueIgnoresMap} from '@/features/local-storage/local-storage';
import Link from 'next/link';
import { fetcher } from '@/utils/fetcher';
import DataView from '@/components/DataView';
import Loader from '@/components/Loader';
import { WEEKS } from '@/utils/consts';
import { WeeksNavbar } from '@/components/WeeksNavbar';
import MissingPlayersNotice from '@/features/missing-players/MissingPlayersNotice';
import { trpc } from '@/utils/trpc';
import AppHeader from '@/components/layout/AppHeader';
import { useGetLocalStorage } from '@/features/local-storage/hooks';
import { useSleeperUserRosterIds } from '@/features/leagues/hooks/useSleeperUserRosterIds';
import { useQuery } from 'react-query';
import { getScheduleData } from '@/features/schedule/data';

// @TODO: error handling
const useSleeperUserMatchupsData = (week: WEEKS, leagueRosterIds?: LeagueRosterIdsMap, leagueIgnores?: LeagueIgnoresMap) => {
    const [filteredLeagueRosterIds, setFilteredRosterIds] = useState<LeagueRosterIdsMap>();
    const {data: matchups, isLoading: isMatchupsLoading} = trpc.useQuery(['sleeper-api.getMatchupsData', {week, leagueRosterIds: leagueRosterIds!}], {
        enabled: filteredLeagueRosterIds !== undefined,
    })

    useEffect(() => {
        if (leagueRosterIds && leagueIgnores) {
            const newLeagueRosterIds = {...leagueRosterIds};
            Object.entries(leagueIgnores).map(([leagueId, shouldInclude]) => {
                if (!shouldInclude) {
                    delete newLeagueRosterIds[leagueId];
                }
            });
            setFilteredRosterIds(newLeagueRosterIds);
        }
    }, [leagueRosterIds]);

    return {matchups, isMatchupsLoading};
}

const UserDashboardPage = (props: {nflWeek: WEEKS}) => {
    const router = useRouter();
    const { id } = router.query;
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(props.nflWeek);
    // @TODO: useGetLocalStorage('settings') and bump into the presetner;
    const {data: cachedSettings} = useGetLocalStorage('settings');
    // DONE - could be wrapped in another presenter
    const {leagueRosterIds, isLeagueRosterIdsLoading} = useSleeperUserRosterIds(id as string);
    const {matchups, isMatchupsLoading} = useSleeperUserMatchupsData(selectedWeek, leagueRosterIds, cachedSettings?.leagueIgnoresMap);
    const {userStarters, oppStarters} = matchups ?? {};
    const {data: scheduleData, isLoading: isScheduleLoading} = useQuery({
        queryKey: ['nfl-schedule'],
        queryFn: () => getScheduleData(selectedWeek)
    })
    // const isLoading = isScheduleLoading || isMatchupsLoading || isLeagueRosterIdsLoading;
    const isLoading = !userStarters || !oppStarters || !scheduleData;
    const [isByGameViewMode, setIsByGameViewMode] = useState(false);
    const { data: playersInfo } = trpc.useQuery(
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
                            <ViewTypeSwitch
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
                        {!isLoading ? <MissingPlayersNotice
                            userStarters={userStarters}
                            playersInfo={playersInfo}
                            scheduleData={scheduleData}
                            />
                        : null}
                        {isLoading ? (
                            <div className='pt-5'>
                                <Loader/>
                            </div>
                        ) : (
                            <DataView
                                userStarters={userStarters}
                                oppStarters={oppStarters}
                                scheduleData={scheduleData}
                                isByGameViewMode={isByGameViewMode}
                                playersInfo={playersInfo}
                            />
                        )}
                    </>
                </section>
            </main>
        </>
    )
};

const ViewTypeSwitch = (props: {isByGameViewMode: boolean; setIsByGameViewMode: (current: boolean) => void}) => {
    const {isByGameViewMode, setIsByGameViewMode} = props;
    const SELECTED_STYLE = 'bg-accent font-semibold text-primary-text';
    const UNSELECTED_STYLE = 'bg-slate-200';
    return (
        <ul className="flex space-x-2">
            <li
            className={`rounded px-1 cursor-pointer ${isByGameViewMode ? UNSELECTED_STYLE : SELECTED_STYLE}`}
            onClick={() => setIsByGameViewMode(false)}>Slim View</li>
            <li
            className={`rounded px-1 cursor-pointer ${isByGameViewMode ? SELECTED_STYLE : UNSELECTED_STYLE}`}
            onClick={() => setIsByGameViewMode(true)}>By Game</li>
        </ul>
    )
}

export default UserDashboardPage;

export const getServerSideProps = async () => {
    const nflWeekObj = await fetcher('https://api.sleeper.app/v1/state/nfl');
    const nflWeek = nflWeekObj.season_type === 'pre' ? WEEKS.WEEK1 : `${nflWeekObj.display_week}` as WEEKS;
    return {
        props: {
            nflWeek
        }
    }
}