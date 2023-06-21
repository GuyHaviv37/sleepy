import React, { useContext } from 'react';
import { getStarterEmoji } from '../content-utils';
import PlayerModalContext from '../../player-modal/PlayerModalContext';

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
    isByGameView?: boolean;
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const { id, position, firstName, lastName, team, multipliers, isConflicted, oppTeam, isHome, isUser: isUserTeam, isByGameView } = props;
    const starterEmoji = getStarterEmoji(multipliers, isConflicted, isUserTeam);
    const { openPlayerModal } = useContext(PlayerModalContext);

    return (
        <div className='flex items-center cursor-pointer py-2' onClick={() => openPlayerModal(id, isUserTeam)}>
            {/* <span className={`pr-1 lg:pr-2`}>{starterEmoji}</span> */}
            <div className={`text-sm pb-1 md:text-base lg:text-lg grid grid-cols-3
            w-full ${starterEmoji ? 'font-bold' : ''}`}>
                <p>{`${position}`}</p>
                <p>
                    <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                    <span>{lastName}</span>
                </p>
                <p className='justify-self-end'>
                    {position !== 'DEF' && <span>{`${team}`}</span>}
                    {isByGameView ? null : <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>}
                </p>
                {/* {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>} */}
            </div>
        </div>
    )
};

export default StarterRow;