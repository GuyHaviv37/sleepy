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
    userScores?: StarterInfo['leagues'];
    oppScores?: StarterInfo['leagues'];
};

const PlayerModal: React.FC<PlayerModalProps> = (props) => {
    const { data: cachedLeaguesInfo } = useGetLocalStorage('leaguesInfo');
    const leagueNames = cachedLeaguesInfo?.leagueNames;
    const { dismissPlayerModal, avatarId, playerName, userScores, oppScores, playerId } = props;
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
                    <div className="relative w-full max-w-2xl p-4 mx-auto bg-primary rounded-md shadow-lg">
                        <div className="mt-3 sm:flex relative">
                            <div className="flex items-center justify-center flex-none mx-auto
                            relative w-32 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-48 max-w-1/2">
                                <Image
                                    alt={`${playerName ?? 'Player\'s'} image`}
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
                                <h2 className="text-lg font-medium text-primary-text md:text-xl lg:text-2xl">
                                    {playerName}
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-primary-text lg:text-lg">My Leagues</h3>
                                        {Object.keys(userScores || {}).length > 0 ? (
                                            Object.entries(userScores || {}).map(([leagueId, score]) => (
                                                <p key={leagueId} className="text-[15px] text-primary-text lg:text-base lg:font-thin">
                                                    {`${leagueNames?.[leagueId]}: ${score}`}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-[15px] text-gray-400 lg:text-base">No leagues</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-primary-text lg:text-lg">Opponent Leagues</h3>
                                        {Object.keys(oppScores || {}).length > 0 ? (
                                            Object.entries(oppScores || {}).map(([leagueId, score]) => (
                                                <p key={leagueId} className="text-[15px] text-primary-text lg:text-base lg:font-thin">
                                                    {`${leagueNames?.[leagueId]}: ${score}`}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-[15px] text-gray-400 lg:text-base">No leagues</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="w-1/4 sm:w-full mt-4 p-1 flex-1 text-primary-text bg-alt rounded-md
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