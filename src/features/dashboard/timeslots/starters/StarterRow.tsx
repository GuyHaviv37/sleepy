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
            <div className={`text-sm pb-1 md:text-base lg:text-lg grid grid-cols-4
            w-full ${starterEmoji ? 'font-bold' : ''}`}>
                <div className='flex w-full col-span-3'>
                    <p className='w-[4ch]'>{`${position}`}</p>
                    <p>
                        <span className={`hidden md:inline pr-1 lg:pr-2`}>{starterEmoji}</span>
                        <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                        <span>{lastName}</span>
                        {multipliers && multipliers > 1 && <span className='hidden lg:inline'>{` (X${multipliers})`}</span>}
                    </p>
                </div>
                <p className='justify-self-end'>
                    {position !== 'DEF' && <span>{`${team}`}</span>}
                    {isByGameView ? null : <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>}
                </p>
            </div>
        </div>
    )
};

export default StarterRow;