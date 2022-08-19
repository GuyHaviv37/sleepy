import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getLocalStorageData, updateLocalStorageData } from '@/utils/localStorage';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { extractUserLeagueRosterIds, extractSleeperMatchupData } from '@/utils/sleeper';
import { extractScheduleData, ScheduleData } from '@/utils/schedule';
import DataView from '@/components/DataView';


// @TODO: unify this with login page typings
const enum CacheStatus {
    'LOADING',
    'MISS',
    'HIT',
}

// @TODO: unify this with settings page for LocalStorageData typings
type LeagueWeightsMap = {[key: string]: number};
type LeagueRosterIdsMap = {[key: string]: string};
export type LeagueNamesMap = {[key: string]: string};

type UserData = {
    sleeperId?: string;
    username?: string;
    leagueWeights?: LeagueWeightsMap;
    leagueRosterIds?: LeagueRosterIdsMap;
    leagueNames?: LeagueNamesMap;
}

const WEEKS = {
    WEEK1: '1',
    WEEK2: '2',
    WEEK3: '3',
    WEEK4: '4',
    WEEK5: '5',
    WEEK6: '6',
    WEEK7: '7',
    WEEK8: '8',
    WEEK9: '9',
    WEEK10: '10',
    WEEK11: '11',
    WEEK12: '12',
    WEEK13: '13',
    WEEK14: '14',
    WEEK15: '15',
    WEEK16: '16',
    WEEK17: '17',
    WEEK18: '18',
} as const;

type WEEKS = typeof WEEKS[keyof typeof WEEKS];

const useLocalStorageUserData = (sleeperId: string): UserData | undefined => {
    const [userData, setUserData] = useState<UserData>();
    useEffect(() => {
        const cachedUserData = getLocalStorageData('user');
        if (cachedUserData?.sleeperId === sleeperId) {
            setUserData(cachedUserData);
        }
    }, [sleeperId]);
    return userData;
};

const useSleeperUserRosterIds = (sleeperId: string, userData?: UserData) => {
    const [leagueRosterIds, setLeagueRosterIds] = useState<LeagueRosterIdsMap>();
    const [isLoadedFromCache, setIsLoadedFromCache] = useState<CacheStatus>(CacheStatus.LOADING);
    const leagueIds = Object.keys(userData?.leagueWeights ?? {});
    const fetchRosterIdRequests = leagueIds.map(leagueId => `https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const {data, error} = useSWR(fetchRosterIdRequests, fetcher);

    useEffect(() => {
        if (userData && userData.leagueRosterIds) {
            setLeagueRosterIds(userData.leagueRosterIds);
            setIsLoadedFromCache(CacheStatus.HIT);
        } else {
            setIsLoadedFromCache(CacheStatus.MISS);
        }
    }, [userData])

    useEffect(() => {
        if (isLoadedFromCache === CacheStatus.MISS && data) {
            const leagueRosterIds = extractUserLeagueRosterIds(data, sleeperId);
            setLeagueRosterIds(leagueRosterIds)
            updateLocalStorageData('user', {leagueRosterIds});
        }
    }, [isLoadedFromCache, data, sleeperId])

    return {leagueRosterIds};
}

const useSleeperUserMatchupsData = (leagueRosterIds: LeagueRosterIdsMap = {}, week: WEEKS) => {
    const leagueIds = Object.keys(leagueRosterIds);
    const matchupRequests = leagueIds.map(leagueId => `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`)
    const {data, error} = useSWR(matchupRequests, fetcher);
    if (!data) {
        // return loading
    }
    if (data && data.length !== leagueRosterIds.length) {
        // return error
    }
    // @TODO: type this
    const leagueMatchupsData: {[key: string]: any} = {};
    data && leagueIds.forEach((leagueId, index) => leagueMatchupsData[leagueId] = data?.[index]);
    return extractSleeperMatchupData(leagueMatchupsData, leagueRosterIds);
};

const useNflSchedule = (week: WEEKS) : ScheduleData | undefined => {
    const {data: espnScoreboardData, error} = useSWR(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week=${week}`, fetcher);
    if (error) {
        console.error(error);
        return;
    }
    if (!espnScoreboardData) return;
    return extractScheduleData(espnScoreboardData);
}

const UserDashboardPage = (props: {nflWeek: WEEKS}) => {
    const router = useRouter();
    const { id } = router.query;
    const userData = useLocalStorageUserData(id as string);
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(props.nflWeek);
    const {leagueRosterIds} = useSleeperUserRosterIds(id as string, userData);
    const {userStarters, oppStarters} = useSleeperUserMatchupsData(leagueRosterIds, selectedWeek);
    const scheduleData = useNflSchedule(selectedWeek);
    const isLoading = !scheduleData || !userStarters || !oppStarters || !userData;

    const getSelectedWeekHandler = (week: WEEKS) => {
        return () => setSelectedWeek(week);
    }

    useEffect(() => {
        if (id && userData && !userData.leagueWeights) {
            router.replace(`/user/${id}/settings`);
        }
    }, [userData, id, router]);
    return (
        <>
            <Head>
                <title>Sleepy</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center p-4 bg-background-main">
                <Link href="/">
                    <h2 className="text-primary text-2xl mb-4 font-bold tracking-wide sm:text-3xl md:text-4xl cursor-pointer">Sleepy</h2>
                </Link>
                <section className="bg-primary w-full rounded-lg py-4 flex flex-col">
                    <div className="flex justify-between">
                        <div className="ml-4">
                            {/* Basic vs Roots vs. Boos switch */}
                            {/* <ViewTypeSwitch/> */}
                        </div>
                        <Link href={`/user/${id}/settings`}>
                            <button className="self-end pr-3 md:pr-6 md:text-lg">&#x2699; <span className="text-primary-text hidden md:inline-block">Settings</span></button>
                        </Link>
                    </div>
                    <>
                        <WeeksNavbar getSelectedWeekHandler={getSelectedWeekHandler} selectedWeek={selectedWeek}/>
                        {isLoading ? (
                            <div className="px-4"><p className="text-primary-text">Loading...</p></div>
                        ) : (
                            <DataView
                                userStarters={userStarters}
                                oppStarters={oppStarters}
                                scheduleData={scheduleData}
                                leagueNames={userData.leagueNames}
                            />
                        )}
                    </>
                </section>
            </main>
        </>
    )
};

interface WeeksNavbarProps {
    selectedWeek: WEEKS;
    getSelectedWeekHandler: (week: WEEKS) => () => void;
}

const WeeksNavbar: React.FC<WeeksNavbarProps> = (props) => {
    const {selectedWeek, getSelectedWeekHandler} = props;

    return (
        <ul className="flex max-w-[90%] mx-auto overflow-y-auto border-2 border-black rounded-lg
        mt-3  space-x-0.5 bg-gray-600">
            {Object.values(WEEKS).map((week) => {
                return (
                <WeeksNavbarItem
                    key={week}
                    isSelected={week === selectedWeek}
                    onSelectHandler={getSelectedWeekHandler(week)}
                    label={`Week ${week}`}
                />
                )
            })}
        </ul>
    )
};

interface WeeksNavbarItemProps {
    isSelected: boolean;
    onSelectHandler: () => void;
    label: string;
}

const WeeksNavbarItem: React.FC<WeeksNavbarItemProps> = (props) => {
    const {isSelected, onSelectHandler, label} = props;

    return (
        <li className={`text-primary-text text-sm min-w-fit p-1 md:text-base md:p-2
        ${isSelected ? 'bg-accent' : 'bg-alt'} hover:bg-accent transition ease-in-out cursor-pointer`} onClick={onSelectHandler}>
            {label}
        </li>
    )
}

const ViewTypeSwitch = () => {
    return (
        <ul className="flex space-x-2">
            <li className="bg-gray-200 text-slate-800
            rounded px-1">Basic</li>
            <li className="bg-green-500 font-semibold
            rounded px-1">Roots vs. Boos</li>
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