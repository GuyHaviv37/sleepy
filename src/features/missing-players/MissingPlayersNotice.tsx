import { ScheduleData } from '@/utils/schedule';
import { Starters } from '@/utils/sleeper';
import React, { useMemo } from 'react';
import { PlayersInfo } from '../../components/DataView/consts';
import { useGetLocalStorage } from '../local-storage/hooks';
import { getMissingPlayersDiff } from './getMissingPlayersDiff';

export interface MissingPlayersNoticeProps {
    userStarters: Starters;
    playersInfo?: PlayersInfo;
    scheduleData: ScheduleData
}

const MissingPlayersNotice: React.FC<MissingPlayersNoticeProps> = (props) => {
    // const {userStarters, playersInfo, scheduleData} = props;
    const {data: cachedSettings} = useGetLocalStorage('settings');
    const {data: cachedLeaguesInfo} = useGetLocalStorage('leaguesInfo');
    const {leagueNames, leagueStarterSpots} = cachedLeaguesInfo ?? {};
    const {shouldShowMissingStarters} = cachedSettings ?? {};
    const {diffInStarters, isSomeDiff} = useMemo(() => getMissingPlayersDiff({...props, leagueStarterSpots}), [props, leagueStarterSpots]);

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