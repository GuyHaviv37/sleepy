import React, { useContext } from 'react';
import DashboardContext from '../../DashboardContext';
import StarterRow from './StarterRow';

interface TimeslotStartersProps {
    starterIds: string[];
    isUser?: boolean;
    isByGameView?: boolean;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const { starterIds, isUser, isByGameView } = props;
    const { playersInfo, userLeagueInfo, oppLeagueInfo, scheduleData } = useContext(DashboardContext);
    const leagueInfo = isUser ? userLeagueInfo : oppLeagueInfo;
    if (starterIds.length === 0) return <div></div>;
    return (
        <div>
            <div className='hidden bg-secondary-accent px-3 py-1 justify-between rounded-t md:grid grid-cols-4
            text-lg tracking-wide font-semibold'>
                <p className='col-span-3'>Players</p>
                <p className='justify-self-end md:justify-self-start'>{isByGameView ? 'Team' : 'Matches'}</p>
            </div>
            <ul className="flex flex-col bg-accent divide-y divide-secondary-accent px-3 py-1 rounded md:rounded-t-none">
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
                            isByGameView={isByGameView} />
                    );
                })}
            </ul>
        </div>
    )
}

export default TimeslotStarters;

