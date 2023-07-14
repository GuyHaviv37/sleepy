import React, { useContext } from 'react';
import DashboardContext from '../DashboardContext';
import { getHighlightStyle } from '../timeslots/content-utils';
import { HIGHLIGHTED_PLAYER_TYPES, HighlightedPlayerType } from './types';
import PlayerModalContext from '../player-modal/PlayerModalContext';

interface HighlightedPlayerProps {
    playerId: string;
    playerHighlightType: HighlightedPlayerType;
}

const HighlightedPlayer = (props: HighlightedPlayerProps) => {
    const { playerId, playerHighlightType } = props;
    const { playersInfo } = useContext(DashboardContext)
    const { emoji, backgroundColor } = getHighlightStyle(playerHighlightType);
    const { openPlayerModal } = useContext(PlayerModalContext);

    const showUserScores = playerHighlightType !== HIGHLIGHTED_PLAYER_TYPES.BOO;
    return (
        <div className='bg-accent rounded p-4 flex gap-3 relative' onClick={() => openPlayerModal(playerId, showUserScores)}>
            <p className={`rounded-full p-3 h-fit ${backgroundColor}`}>{emoji}</p>
            <div className='text-sm'>
                <p className='text-primary-text w-32 line-clamp-1'>{playersInfo[playerId]?.position} {playersInfo[playerId]?.firstName} {playersInfo[playerId]?.lastName}</p>
                <p className='text-gray-400'>{playersInfo[playerId]?.team}</p>
            </div>
            <p className='text-xs absolute bottom-0 right-0 bg-secondary-accent text-gray-300 rounded min-w-32 px-2 py-1'>Score: 100</p>
        </div>
    )
};

export default HighlightedPlayer;