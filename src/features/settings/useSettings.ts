import { useState, useEffect } from "react";
import { SleeperLeagueData } from "../leagues/leagues.types";
import { useGetLocalStorage } from "../local-storage/hooks";
import { LeagueWeightsMap, LeagueIgnoresMap } from "../local-storage/local-storage";
import { CacheStatus } from "../local-storage/local-storage.types";
import { mergeLeagueSettings } from "./mergeLeagueSettings";

export const useSettings = (leagues: SleeperLeagueData[]) => {
    const { data: cachedSettings, cacheStatus: cachedSettingsStatus } = useGetLocalStorage('settings');
    const [leagueWeightsMap, setLeagueWeightsMap] = useState<LeagueWeightsMap>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.leagueWeightsMap : {});
    const [leagueIgnoresMap, setLeagueIgnoresMap] = useState<LeagueIgnoresMap>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.leagueIgnoresMap : {});
    const [shouldShowCloseMatchupMargin, setShouldShowCloseMatchupMargin] = useState<boolean>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.shouldShowCloseMatchupMargin : false);
    const [closeMatchupMargin, setCloseMatchupMargin] = useState<number | null>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.closeMatchupMargin : null);
    const [shouldShowMissingStarters, setShouldShowMissingStarters] = useState<boolean>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.shouldShowMissingStarters : true);
    const [shouldShowAverageScore, setShouldShowAverageScore] = useState<boolean>(cachedSettingsStatus === CacheStatus.HIT ? cachedSettings!.shouldShowAverageScore : true);
    useEffect(() => {
        if (cachedSettingsStatus === CacheStatus.HIT && cachedSettings) {
            setLeagueWeightsMap(cachedSettings.leagueWeightsMap);
            setLeagueIgnoresMap(cachedSettings.leagueIgnoresMap);
            setShouldShowMissingStarters(cachedSettings.shouldShowMissingStarters);
            setShouldShowAverageScore(cachedSettings.shouldShowAverageScore);
            setShouldShowCloseMatchupMargin(cachedSettings.shouldShowCloseMatchupMargin ?? false);
            setCloseMatchupMargin(cachedSettings.closeMatchupMargin ?? null)
        }
    }, [cachedSettingsStatus]);


    useEffect(() => {
        const { mergeLeagueIgnoresMap, mergeLeagueWeightsMap } = mergeLeagueSettings(leagues, leagueWeightsMap, leagueIgnoresMap);
        setLeagueWeightsMap(mergeLeagueWeightsMap)
        setLeagueIgnoresMap(mergeLeagueIgnoresMap)
    }, [leagues])

    const onChangeLeagueWeight = (leagueId: string, weight: number) => {
        setLeagueWeightsMap(currentMap => ({ ...currentMap, [leagueId]: weight }));
    }

    const onChangeLeagueIgnore = (leagueId: string, shouldShow: boolean) => {
        setLeagueIgnoresMap(currentMap => ({ ...currentMap, [leagueId]: shouldShow }));
    }

    const onChangeShowMissingStarters = (shouldShow: boolean) => {
        setShouldShowMissingStarters(shouldShow);
    }

    const onChangeShowAverageScore = (shouldShow: boolean) => {
        setShouldShowAverageScore(shouldShow);
    }

    const onChangeShowCloseMatchupMargin = (shouldShow: boolean) => {
        setShouldShowCloseMatchupMargin(shouldShow);
    }

    const onChangeCloseMatchupMargin = (margin: number) => {
        if (Number.isNaN(margin)) return;
        setCloseMatchupMargin(margin);
    }

    return {
        leagueIgnoresMap,
        leagueWeightsMap,
        shouldShowMissingStarters,
        shouldShowAverageScore,
        closeMatchupMargin,
        shouldShowCloseMatchupMargin,
        onChangeLeagueIgnore,
        onChangeLeagueWeight,
        onChangeShowMissingStarters,
        onChangeShowAverageScore,
        onChangeShowCloseMatchupMargin,
        onChangeCloseMatchupMargin
    };
};
