import React, { useContext, useMemo } from 'react';
import DashboardContext from '../DashboardContext';
import HighlightedPlayer from './HighlightedPlayer';
import { getHighlightedPlayers } from './extractors';

const HighlightedPlayers = () => {
    const { userLeagueInfo, oppLeagueInfo } = useContext(DashboardContext);
    // @TODO: sort by gametime
    const highlightedPlayers = useMemo(() => getHighlightedPlayers(userLeagueInfo, oppLeagueInfo), []);

    const shouldShowHighlightedPlayers = Object.keys(highlightedPlayers).length >= 1;
    return (
        shouldShowHighlightedPlayers ? <div>
            <p className='text-primary-text mb-2 text-lg font-semibold'>Spotlight Players</p>
            {/* @TODO: scrollbar for desktop */}
            <ul className='col-span-2 flex gap-3 overflow-scroll py-1 scrollbar-thin scrollbar-thumb-accent scrollbar-track-secondary-accent'>
                {Object.entries(highlightedPlayers).map(([playerId, { hightlightedPlayerType, conflictScore }]) => (
                    <HighlightedPlayer key={playerId} playerId={playerId} playerHighlightType={hightlightedPlayerType} conflictScore={conflictScore} />
                ))}
            </ul>
        </div> : null
    )
};

export default HighlightedPlayers;
