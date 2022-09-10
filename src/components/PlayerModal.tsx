import React from 'react';
import Image from 'next/image';
import { StarterInfo } from '@/utils/sleeper';

interface PlayerModalProps {
    setOpenModal: (openOrClose: boolean) => void;
    avatarId?: string | null;
    playerName?: string;
    scores?: StarterInfo['leagues'];
    leagueNames?: {[leagueId: string]: string};
};

const PlayerModal: React.FC<PlayerModalProps> = (props) => {
    const {setOpenModal, avatarId, playerName, scores, leagueNames} = props;
    return (
        <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={() => setOpenModal(false)}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                    <div className="relative w-full max-w-lg p-4 mx-auto bg-primary rounded-md shadow-lg">
                        <div className="mt-3 sm:flex relative">
                            <div className="flex items-center justify-center flex-none mx-auto
                            relative relative w-32 h-[5.7rem] sm:w-48 sm:h-40 lg:w-64 lg:h-52 max-w-1/2">
                                <Image
                                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${avatarId}.png`}
                                    layout="fill"
                                    objectFit='contain'
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
                                    onClick={() => setOpenModal(false)}
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