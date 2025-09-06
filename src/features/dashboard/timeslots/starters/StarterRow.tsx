import React, { useContext } from 'react';
import { getHighlightStyle, getStarterHighlightType } from '../content-utils';
import PlayerModalContext from '../../player-modal/PlayerModalContext';
import { logStarterClicked } from '../../bi';
import { useGetLocalStorage } from '../../../local-storage/hooks';

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
    scores?: { [leagueId: string]: number };
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const { id, position, firstName, lastName, team, multipliers, isConflicted, oppTeam, isHome, isUser: isUserTeam, isByGameView, scores } = props;
    const highlightType = getStarterHighlightType(multipliers, isConflicted, isUserTeam);
    const highlightStyle = highlightType ? getHighlightStyle(highlightType) : null;
    const { openPlayerModal } = useContext(PlayerModalContext);

    const { data: cachedSettings } = useGetLocalStorage('settings');
    const shouldShowAverageScore = cachedSettings?.shouldShowAverageScore ?? true; // Default to true

    const averageScore = scores && Object.keys(scores).length > 0
        ? Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
        : null;

    const onStarterClick = () => {
        logStarterClicked();
        openPlayerModal(id)
    }

    return (
        <li className='flex items-center cursor-pointer py-2' onClick={onStarterClick}>
            <div className={`text-sm pb-1 md:text-base grid grid-cols-4
            w-full ${highlightStyle ? 'font-bold' : ''}`}>
                <div className='flex w-full col-span-3'>
                    <p className='w-[4ch]'>{`${position}`}</p>
                    <div className='flex flex-col'>
                        <p>
                            <span className={`hidden md:inline pr-1 lg:pr-2`}>{highlightStyle?.emoji}</span>
                            <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                            <span>{lastName}</span>
                            {multipliers && multipliers > 1 && <span className='hidden lg:inline'>{` (X${multipliers})`}</span>}
                        </p>
                    </div>
                </div>
                <p className='justify-self-end md:justify-self-start'>
                    {position !== 'DEF' && <span>{`${team}`}</span>}
                    {isByGameView ? null : <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>}
                </p>
                <div className='col-span-4'>
                    {averageScore !== null && averageScore > 0.0 && shouldShowAverageScore && (
                        <p className='text-[10px] lg:text-sm text-gray-400 mt-0.5 text-left'>
                            <span className='hidden sm:inline'>Average score: </span>
                            <span className='sm:hidden'>Avg. score: </span>
                            {averageScore.toFixed(1)}
                        </p>
                    )}
                </div>
            </div>

        </li>
    )
};

export default StarterRow;