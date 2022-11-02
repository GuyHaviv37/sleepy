import { UserData } from '@/utils/localStorage';
import { ScheduleData } from '@/utils/schedule';
import { Starters } from '@/utils/sleeper';
import React, { useMemo } from 'react';
import { PlayersInfo } from './DataView/consts';

interface MissingPlayersNoticeProps {
    userStarters: Starters;
    userData: UserData;
    playersInfo?: PlayersInfo;
    scheduleData: ScheduleData
}

const MissingPlayersNotice: React.FC<MissingPlayersNoticeProps> = (props) => {
    const {userStarters, userData, playersInfo, scheduleData} = props;
    const {leagueNames, leagueStarterSpots} = userData;
    console.log('scheduleData', scheduleData);
    const startersCountPerLeague = useMemo(() => {
        const startersCountPerLeague: {[leagueId: string]: number} = {};
        Object.entries(userStarters).forEach(([starterId, starterData]) => {
            const starterLeagueIds = Object.keys(starterData.leagues ?? {});
            const starterTeam = playersInfo?.[starterId]?.team ?? 'N/A';
            const starterIsPlaying = !!scheduleData.byTeam[starterTeam];
            if (starterIsPlaying) {
                starterLeagueIds.forEach(leagueId => {
                    if (startersCountPerLeague[leagueId]) {
                        // @ts-ignore
                        startersCountPerLeague[leagueId] = startersCountPerLeague[leagueId] + 1;
                    } else {
                        startersCountPerLeague[leagueId] = 1;
                    }
                })
            }
        });
        return startersCountPerLeague;
    }, [userStarters])
    let isSomeDiff = false;
    const diffInStarters: {[leagueId: string]: number} = Object.keys(startersCountPerLeague).reduce((acc, leagueId) => {
        const diff = (leagueStarterSpots?.[leagueId] ?? 0) - (startersCountPerLeague?.[leagueId] ?? 0);
        if (diff > 0) {
            isSomeDiff = true;
        }
        return {...acc, [leagueId]: diff}
    }, {})
    return isSomeDiff ? (
        <div className='mx-4 my-2 text-primary-text bg-rose-500 rounded p-2'>
            <h5 className='text-sm md:text-base'>⚠️ Notice !</h5>
            <p className='text-xs md:text-sm mb-2'>You got some missing starters in your lineups:</p>
            {Object.entries(diffInStarters).map(([leagueId, diff]) => {
                return (diff !== 0) ?
                <li className='text-sm md:text-base list-none'>{leagueNames?.[leagueId]} - {diff}</li> 
                : null;
            })}
        </div>
    ): null;
};

export default MissingPlayersNotice;