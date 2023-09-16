import React, { useContext, useMemo } from 'react';
import DashboardContext from '../DashboardContext';
import HighlightedPlayer from './HighlightedPlayer';
import { getHighlightedPlayers } from './extractors';
import MissingPlayersNotice from '@/features/missing-players/MissingPlayersNotice';
import { extractStartersByTimeslot } from '../extractors';
import { getCondensedTimeslotString } from '../timeslots/content-utils';

interface HighlightedPlayersProps {
    timeslots: string[];
}

const HighlightedPlayers = (props: HighlightedPlayersProps) => {
    const { timeslots } = props;
    const { userLeagueInfo, oppLeagueInfo, scheduleData, playersInfo } = useContext(DashboardContext);
    const highlightedPlayers = getHighlightedPlayers(userLeagueInfo, oppLeagueInfo);
    const highlightedPlayersIds = Object.keys(highlightedPlayers);
    const highLightedPlayersIdsByTimeslots = extractStartersByTimeslot(scheduleData.byTeam, timeslots, highlightedPlayersIds, playersInfo)

    const shouldShowHighlightedPlayers = Object.keys(highlightedPlayers).length >= 1;
    return (
        shouldShowHighlightedPlayers ? <div>
            <div className='flex gap-3 align-center'>
                <p className='text-primary-text mb-2 text-lg font-semibold'>Spotlight Players</p>
                <MissingPlayersNotice />
            </div>
            <ul className='col-span-2 flex gap-3 overflow-scroll py-2 scrollbar-thin scrollbar-thumb-accent scrollbar-track-secondary-accent'>
                {timeslots.map(timeslot => {
                    const hightlightedPlayersForTimeslot = highLightedPlayersIdsByTimeslots[timeslot];
                    if (hightlightedPlayersForTimeslot === undefined || hightlightedPlayersForTimeslot.length === 0) return null;
                    return (
                        <div className='flex flex-col' key={`highlighted_players_timeslot_${timeslot}`}>
                            <p className='z-10 text-xs bg-[#202c40] text-primary-text rounded px-2 py-1 w-fit'>{getCondensedTimeslotString(timeslot)}</p>
                            <ul className='flex gap-3 mt-2'>
                                {hightlightedPlayersForTimeslot.map(playerId => {
                                    const { hightlightedPlayerType, conflictScore } = highlightedPlayers[playerId]!;
                                    return <HighlightedPlayer key={playerId} playerId={playerId} playerHighlightType={hightlightedPlayerType} conflictScore={conflictScore} />;
                                })}
                            </ul>
                        </div>
                    )
                })}
            </ul>
        </div> : null
    )
};

export default HighlightedPlayers;
