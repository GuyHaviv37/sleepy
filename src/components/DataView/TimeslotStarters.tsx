import { ScheduleData } from '@/utils/schedule';
import { Starters } from '@/utils/sleeper';
import React from 'react';
import { PlayersInfo } from './consts';
import { getStarterEmoji } from './utils';

interface TimeslotStartersProps {
    starterIds: string[];
    playersInfo: PlayersInfo;
    leagueInfo: Starters;
    scheduleData: ScheduleData;
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
    isUser?: boolean;
    isByGameView?: boolean;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const { starterIds, playersInfo, leagueInfo, scheduleData, isUser, openPlayerModal, isByGameView } = props;
    return (
        <div className="flex flex-col lg:items-center">
            {starterIds.map(starterId => {
                if (!playersInfo[starterId]) return null;
                const playerTeam = playersInfo[starterId]?.team;
                const oppTeam = playerTeam ? scheduleData.byTeam[playerTeam]?.oppTeam : undefined;
                const isHome = playerTeam ? scheduleData.byTeam[playerTeam]?.isHomeTeam : undefined;
                return (
                    <StarterRow
                        key={starterId}
                        id={starterId}
                        firstName={playersInfo[starterId]?.firstName}
                        lastName={playersInfo[starterId]?.lastName}
                        position={playersInfo[starterId]?.position}
                        team={playerTeam}
                        multipliers={Object.keys(leagueInfo[starterId]?.leagues ?? []).length}
                        isConflicted={leagueInfo[starterId]?.isConflicted}
                        oppTeam={oppTeam}
                        isHome={isHome}
                        isUser={isUser}
                        openPlayerModal={openPlayerModal}
                        isByGameView={isByGameView}
                    />
                )
            })
            }
        </div>
    )
}

export default TimeslotStarters;

// @TODO: work out scores UI
interface StarterRowProps {
    id: string;
    firstName?: string;
    lastName?: string;
    position?: string | null;
    team?: string | null;
    multipliers?: number;
    isConflicted?: boolean;
    oppTeam?: string;
    isHome?: boolean;
    isUser?: boolean;
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
    isByGameView?: boolean;
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const { id, position, firstName, lastName, team, multipliers, isConflicted, oppTeam, isHome, isUser: isUserTeam, openPlayerModal, isByGameView } = props;
    const starterEmoji = getStarterEmoji(multipliers, isConflicted, isUserTeam);
    return (
        <div className='flex items-center cursor-pointer' onClick={() => openPlayerModal(id, isUserTeam)}>
            <p className="text-sm pb-1 md:text-base lg:text-lg lg:self-end">
                <span className={`pr-1 lg:pr-2`}>{starterEmoji}</span>
                <span className={starterEmoji ? 'font-bold' : ''}>
                    <span>{`${position} `}</span>
                    <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                    <span>{lastName}</span>
                    {position !== 'DEF' && <span>{` ,${team}`}</span>}
                    {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>}
                    {isByGameView ? null : <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>}
                </span>
            </p>
        </div>
    )
};