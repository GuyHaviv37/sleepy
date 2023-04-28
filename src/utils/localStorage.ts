import { useEffect, useState } from "react";

export const enum CacheStatus {
    'LOADING',
    'MISS',
    'HIT',
}

export type LeagueWeightsMap = { [key: string]: number };
export type LeagueRosterIdsMap = { [key: string]: string };
export type LeagueIgnoresMap = { [key: string]: boolean };
export type LeagueNamesMap = { [key: string]: string };
export type LeagueStarterSpots = { [key: string]: number };

export type UserData = {
    sleeperId?: string;
    username?: string;
    leagueWeights?: LeagueWeightsMap;
    leagueRosterIds?: LeagueRosterIdsMap;
    leagueNames?: LeagueNamesMap;
    leagueIgnores?: LeagueIgnoresMap;
    leagueStarterSpots?: LeagueStarterSpots;
    shouldShowMissingStarters?: boolean;
}

export const getLocalStorageData = (key: string) => {
    if (typeof window !== undefined) {
        const jsonItem = window.localStorage.getItem(key);
        if (jsonItem) {
            return JSON.parse(jsonItem);
        }
    }
}

export const setLocalStorageData = (key: string, data: any) => {
    if (typeof window !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(data));
    } else return undefined;
    return data;
}

export const updateLocalStorageData = (key: string, newData: any) => {
    const existingData = getLocalStorageData(key);
    if (!existingData) return undefined;
    setLocalStorageData(key, { ...existingData, ...newData });
    return { ...existingData, ...newData };
}

export const useGetLocalStorage = <T = any>(key: string) => {
    const [cacheStatus, setCacheStatus] = useState(CacheStatus.LOADING);
    const [data, setData] = useState<T>();

    useEffect(() => {
        try {
            const user = getLocalStorageData('user');
            if (user) {
                setData(user);
                setCacheStatus(CacheStatus.HIT)
            } else {
                console.log(`Error: a falsy value for ${key} was saved to cache`);
                setCacheStatus(CacheStatus.MISS);
            }
        }
        catch (error) {
            // @TODO: fedops
            console.error(`Error fetching ${key} from cache:`, error);
            setCacheStatus(CacheStatus.MISS);
        }
    }, [])

    const clear = () => {
        setCacheStatus(CacheStatus.MISS);
    }

    return {cacheStatus, data, clear};
}