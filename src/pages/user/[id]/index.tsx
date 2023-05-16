import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { LeagueRosterIdsMap, LeagueIgnoresMap} from '@/features/local-storage/local-storage';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { extractSleeperMatchupData, LeagueMatchup } from '@/utils/sleeper';
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

const useSleeperUserMatchupsData = (leagueRosterIds: LeagueRosterIdsMap = {}, week: WEEKS, leagueIgnores?: LeagueIgnoresMap) => {
    const leagueIds = Object.keys(leagueRosterIds);
    // @TODO: I think we should move to server since this is not effecient for so many calls in client for a simple JSON response
    const matchupRequests = leagueIds.map(leagueId => `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
    const {data, error} = useSWR(matchupRequests, fetcher);
    const isSingleLeague = data?.[0].roster_id;
    const refinedData = isSingleLeague ? [data] : data;
    if (error) {
        // @TODO - fedops
        console.error('Error: could not fetch user matcups data', error);
    }
    if (refinedData && refinedData.length !== leagueIds.length) {
        // @TODO - fedops
        console.error('Error: data and leagueRosterIds are not of the same length', refinedData);
    }
    const filteredLeagueIds = leagueIgnores ? leagueIds.filter(leagueId => leagueIgnores[leagueId]) : leagueIds;
    const leagueMatchupsData:  {[leagueId: string]: LeagueMatchup[]} = {};
    refinedData && filteredLeagueIds.forEach((leagueId) => {
        const leagueIndex = leagueIds.findIndex(someLeagueId => someLeagueId === leagueId);
        leagueMatchupsData[leagueId] = refinedData?.[leagueIndex]
    });
    return extractSleeperMatchupData(leagueMatchupsData, leagueRosterIds);
};

const UserDashboardPage = (props: {nflWeek: WEEKS}) => {
    const router = useRouter();
    const { id } = router.query;
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(props.nflWeek);
    // @TODO: useGetLocalStorage('settings') and bump into the presetner;
    const {data: cachedSettings} = useGetLocalStorage('settings');
    // DONE - could be wrapped in another presenter
    const {leagueRosterIds, isLeagueRosterIdsLoading} = useSleeperUserRosterIds(id as string);
    const {userStarters, oppStarters} = useSleeperUserMatchupsData(leagueRosterIds, selectedWeek, cachedSettings?.leagueIgnoresMap);
    const {data: scheduleData} = useQuery({
        queryKey: ['nfl-schedule'],
        queryFn: () => getScheduleData(selectedWeek)
    })
    // @TODO handle loading
    const isLoading = !scheduleData || !userStarters || !oppStarters || !cachedSettings;
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