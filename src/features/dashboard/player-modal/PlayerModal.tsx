import React, { useState } from 'react';
import Image from 'next/image';
import { StarterInfo } from '@/features/leagues/leagues.types';
import { useGetLocalStorage } from '../../local-storage/hooks';
import { getPlayerImageById } from './content-utils';

interface PlayerModalProps {
    dismissPlayerModal: () => void;
    avatarId?: string | null;
    playerId?: string;
    playerName?: string;
    scores?: StarterInfo['leagues'];
};

const PlayerModal: React.FC<PlayerModalProps> = (props) => {
    const { data: cachedLeaguesInfo } = useGetLocalStorage('leaguesInfo');
    const leagueNames = cachedLeaguesInfo?.leagueNames;
    const { dismissPlayerModal, avatarId, playerName, scores, playerId } = props;
    const [imageError, setImageError] = useState(false);
    const playerImageSrc = getPlayerImageById(playerId);
    return (
        <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={dismissPlayerModal}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                    <div className="relative w-full max-w-lg p-4 mx-auto bg-primary rounded-md shadow-lg">
                        <div className="mt-3 sm:flex relative">
                            <div className="flex items-center justify-center flex-none mx-auto
                            relative w-32 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-48 max-w-1/2">
                                <Image
                                    src={!imageError ?
                                        playerImageSrc :
                                        `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${avatarId}.png`
                                    }
                                    layout="fill"
                                    objectFit='contain'
                                    objectPosition='bottom'
                                    onError={() => setImageError(true)}
                                    className='rounded-full bg-[#8B96A8]'
                                />
                            </div>
                            <div className="mt-2 text-center sm:text-left sm:flex sm:flex-col sm:px-4">
                                <h4 className="text-lg font-medium text-primary-text md:text-xl lg:text-2xl">
                                    {playerName}
                                </h4>
                                <div>
                                    {Object.entries(scores ?? {}).map(([leagueId, score]) => {
                                        return (
                                            <p key={leagueId} className="mt-2 text-[15px] text-primary-text lg:text-base lg:font-thin">
                                                {`${leagueNames?.[leagueId]}: ${score}`}
                                            </p>)
                                    })}
                                </div>
                                <button
                                    className="w-1/4 sm:w-full mt-2 p-1 flex-1 text-primary-text bg-alt rounded-md
                                    sm:flex-end sm:max-h-10 sm:mt-auto
                                    outline-none border ring-offset-2 ring-alt-600 focus:ring-2"
                                    onClick={dismissPlayerModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerModal;