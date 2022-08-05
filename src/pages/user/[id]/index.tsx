import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getLocalStorageData } from '@/utils/localStorage';
import Link from 'next/link';

// @TODO: unify this with settings page for LocalStorageData typings
type LeagueWeightsMap = {[key: string]: number};

type UserData = {
    sleeperId?: string;
    username?: string;
    leagueWeights?: LeagueWeightsMap
}

const WEEKS = {
    WEEK1: 'Week 1',
    WEEK2: 'Week 2',
    WEEK3: 'Week 3',
    WEEK4: 'Week 4',
    WEEK5: 'Week 5',
    WEEK6: 'Week 6',

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

const UserDashboardPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const userData = useLocalStorageUserData(id as string);
    const [selectedWeek, setSelectedWeek] = useState<WEEKS>(WEEKS.WEEK1);

    const getSelectedWeekHandler = (week: WEEKS) => {
        return () => setSelectedWeek(week);
    }

    useEffect(() => {
        if (id && userData && !userData.leagueWeights) {
            router.replace(`/user/${id}/settings`);
        }
    }, [userData, id]);
    return (
        <>
            <Head>
                <title>Sleeper Sunday Cheatsheet</title>
                <meta name="description" content="Sleeper Fantasy Football Sunday Board" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4 bg-background-main">
                <h2 className="text-primary text-2xl mb-4 font-bold tracking-wide">Your Board</h2>
                <section className="bg-primary w-full rounded-lg py-4 flex flex-col">
                    <div className="flex justify-between">
                        <div className="ml-4">
                            {/* Basic vs Roots vs. Boos switch */}
                            <ViewTypeSwitch/>
                        </div>
                        <Link href={`/user/${id}/settings`}>
                            <button className="self-end pr-3 md:pr-6">&#x2699; <span className="text-primary-text hidden md:inline-block">Settings</span></button>
                        </Link>
                    </div>
                    {!userData ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <WeeksNavbar getSelectedWeekHandler={getSelectedWeekHandler} selectedWeek={selectedWeek}/>
                            <div>Actual Data View</div>
                        </>
                    )}
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
                <WeeksNavbarItem isSelected={week === selectedWeek} onSelectHandler={getSelectedWeekHandler(week)} label={week}/>
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
        <li className={`text-primary-text text-sm min-w-fit p-1 ${isSelected ? 'bg-accent' : 'bg-alt'} hover:bg-accent cursor-pointer`} onClick={onSelectHandler}>
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