import React, { useContext } from 'react';
import DashboardContext from '../../DashboardContext';
import StarterRow from './StarterRow';

interface TimeslotStartersProps {
    starterIds: string[];
    isUser?: boolean;
    isByGameView?: boolean;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const { starterIds,  isUser, isByGameView } = props;
    const { playersInfo, userLeagueInfo, oppLeagueInfo, scheduleData} = useContext(DashboardContext);
    const leagueInfo = isUser ? userLeagueInfo : oppLeagueInfo;
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
                        isByGameView={isByGameView}
                    />
                )
            })
            }
        </div>
    )
}

export default TimeslotStarters;

