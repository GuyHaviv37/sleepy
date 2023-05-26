import React, { useContext, useMemo } from 'react';
import { useGetLocalStorage } from '../local-storage/hooks';
import { getMissingPlayersDiff } from './getMissingPlayersDiff';
import DashboardContext from '../dashboard/DashboardContext';


const MissingPlayersNotice: React.FC = () => {
    const {data: cachedSettings} = useGetLocalStorage('settings');
    const {data: cachedLeaguesInfo} = useGetLocalStorage('leaguesInfo');
    const {leagueNames, leagueStarterSpots} = cachedLeaguesInfo ?? {};
    const {shouldShowMissingStarters} = cachedSettings ?? {};
    const {userLeagueInfo: userStarters, playersInfo, scheduleData} = useContext(DashboardContext);
    const {diffInStarters, isSomeDiff} = useMemo(() => getMissingPlayersDiff({userStarters, playersInfo, leagueStarterSpots, scheduleData}), [leagueStarterSpots]);

    return shouldShowMissingStarters && isSomeDiff ? (
        <div className='mx-4 my-2 text-primary-text bg-rose-500 rounded p-2'>
            <h5 className='text-sm md:text-base'>⚠️ Notice !</h5>
            <p className='text-xs md:text-sm mb-2'>You got some missing starters in your lineups:</p>
            {Object.entries(diffInStarters).map(([leagueId, diff]) => {
                return (diff !== 0) ?
                <li className='text-sm md:text-base list-none' key={leagueId}>{leagueNames?.[leagueId]} - {diff}</li> 
                : null;
            })}
        </div>
    ): null;
};

export default MissingPlayersNotice;