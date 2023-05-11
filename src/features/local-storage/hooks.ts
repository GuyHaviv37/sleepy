import { useState, useEffect } from "react";
import { getLocalStorageData } from "./local-storage";
import { CacheStatus } from "./local-storage.types";
import type { Cache } from './local-storage';

export const useGetLocalStorage = <K extends keyof Cache>(key: K): {data: Cache[K] | undefined; cacheStatus: CacheStatus; clear: () => void} => {
    const [cacheStatus, setCacheStatus] = useState(CacheStatus.LOADING);
    const [data, setData] = useState<Cache[typeof key]>();

    useEffect(() => {
        try {
            const data = getLocalStorageData(key);
            if (data) {
                setData(data);
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