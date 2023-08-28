import React, { useContext } from 'react';
import DashboardContext from '../DashboardContext';
import { getHighlightStyle } from '../timeslots/content-utils';
import { HIGHLIGHTED_PLAYER_TYPES, HighlightedPlayerType } from './types';
import PlayerModalContext from '../player-modal/PlayerModalContext';
import * as bi from './bi';

interface HighlightedPlayerProps {
    playerId: string;
    playerHighlightType: HighlightedPlayerType;
    conflictScore?: number;
}

const HighlightedPlayer = (props: HighlightedPlayerProps) => {
    const { playerId, playerHighlightType, conflictScore } = props;
    const { playersInfo } = useContext(DashboardContext)
    const { emoji, backgroundColor } = getHighlightStyle(playerHighlightType);
    const { openPlayerModal } = useContext(PlayerModalContext);

    const onPlayerClicked = () => {
        bi.logSpotlightPlayerClicked(playerHighlightType);
        openPlayerModal(playerId, showPlayerScores)
    }

    const showPlayerScores = playerHighlightType !== HIGHLIGHTED_PLAYER_TYPES.BOO;
    const showPlayerConflictScore = playerHighlightType === HIGHLIGHTED_PLAYER_TYPES.CONFLICTED && conflictScore !== undefined && !isNaN(conflictScore);
    return (
        <li className='bg-accent rounded p-4 flex gap-3 relative cursor-pointer' onClick={onPlayerClicked}>
            <p className={`rounded-full p-3 h-fit lg:text-lg ${backgroundColor}`}>{emoji}</p>
            <div className='text-sm'>
                <p className='text-primary-text w-32 line-clamp-1'>{playersInfo[playerId]?.position} {playersInfo[playerId]?.firstName} {playersInfo[playerId]?.lastName}</p>
                <p className='text-gray-400'>{playersInfo[playerId]?.team}</p>
            </div>
            {showPlayerConflictScore && <p className='text-xs absolute bottom-0 right-0 bg-secondary-accent text-gray-300 rounded min-w-32 px-2 py-1'>Conflict Score: {conflictScore}</p>}
        </li>
    )
};

export default HighlightedPlayer;