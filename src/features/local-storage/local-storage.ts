export type LeagueWeightsMap = { [key: string]: number };
export type LeagueRosterIdsMap = { [key: string]: number };
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
    shouldShowAverageScore?: boolean;
}

type CacheUserInfo = {
    sleeperId?: string;
    username?: string;
}

type CacheUserSettings = {
    leagueWeightsMap: LeagueWeightsMap;
    leagueIgnoresMap: LeagueIgnoresMap;
    shouldShowMissingStarters: boolean;
    shouldShowAverageScore: boolean;
}

type CacheUserLeaguesInfo = {
    leagueNames?: LeagueNamesMap;
    leagueStarterSpots?: LeagueStarterSpots;
    leagueRosterIds?: LeagueRosterIdsMap;
}

export type Cache = {
    settings: CacheUserSettings;
    user: CacheUserInfo;
    leaguesInfo: CacheUserLeaguesInfo;
}

type CacheKey = keyof Cache;
type CacheValue = Cache[CacheKey];

export const getLocalStorageData = (key: CacheKey) => {
    if (typeof window !== undefined) {
        const jsonItem = window.localStorage.getItem(key);
        if (jsonItem) {
            return JSON.parse(jsonItem);
        }
    }
}

export const setLocalStorageData = (key: CacheKey, data: CacheValue) => {
    if (typeof window !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(data));
    } else return undefined;
    return data;
}

export const deleteLocalStorageData = (key: CacheKey) => {
    if (typeof window !== undefined) {
        window.localStorage.removeItem(key);
    }
}

export const safeUpdateLocalStorageData = (key: CacheKey, data: CacheValue) => {
    const existingData = getLocalStorageData(key);
    if (existingData) {
        updateLocalStorageData(key, data);
    } else {
        setLocalStorageData(key, data);
    }
};

export const patchLocalStorageData = (key: CacheKey, data: CacheValue) => {
    const existingData = getLocalStorageData(key);
    updateLocalStorageData(key, { ...existingData, ...data });
}

// @TODO: change newData to CacheValue after user/id index page
export const updateLocalStorageData = (key: CacheKey, newData: any) => {
    const existingData = getLocalStorageData(key);
    if (!existingData) return undefined;
    setLocalStorageData(key, { ...existingData, ...newData });
    return { ...existingData, ...newData };
}