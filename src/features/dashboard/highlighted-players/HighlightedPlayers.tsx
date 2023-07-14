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
            <div className='col-span-2 flex gap-3 overflow-scroll'>
                {Object.entries(highlightedPlayers).map(([playerId, playerHighlightType]) => (
                    <HighlightedPlayer playerId={playerId} playerHighlightType={playerHighlightType} />
                ))}
            </div>
        </div> : null
    )
};

export default HighlightedPlayers;
