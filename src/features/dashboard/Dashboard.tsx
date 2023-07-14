import React, { useContext } from 'react';
import DashboardContext from './DashboardContext';
import PlayerModal from '@/features/dashboard/player-modal/PlayerModal';
import { usePlayerModal } from '@/features/dashboard/player-modal/usePlayerModal';
import { useDashboardPresenter } from './useDashboardPresenter';
import PlayerModalContext from './player-modal/PlayerModalContext';
import Timeslots from './timeslots/Timeslots';
import { TimeslotViewMode } from './timeslots/timeslot.types';
import HighlightedPlayers from './highlighted-players/HighlightedPlayers';

interface DashboardProps {
    isByGameViewMode: boolean;
}


const Dashboard: React.FC<DashboardProps> = (props) => {
    const { playersInfo, userLeagueInfo, oppLeagueInfo } = useContext(DashboardContext);
    const { isByGameViewMode } = props;
    const { timeslots, userStartersByTimeslot, oppStartersByTimeslot } = useDashboardPresenter();
    const { selectedPlayer, showPlayerModal, openPlayerModal, dismissPlayerModal } = usePlayerModal()
    const { playerId: selectedPlayerId, isUser: isUserSelectedPlayer } = selectedPlayer;

    return (
        <>
            <PlayerModalContext.Provider value={{ openPlayerModal }}>
                <HighlightedPlayers />
                <section className='grid grid-cols-2 gap-3 text-primary-text lg:pt-6 pt-3'>
                    <h6 className="text-lg">{'Your players'}</h6>
                    <h6 className="text-lg">{'Opponent\'s players'}</h6>
                    <div className="grid grid-cols-2 col-span-2 gap-3">
                        <Timeslots timeslots={timeslots}
                            viewMode={isByGameViewMode ? TimeslotViewMode.BY_GAME : TimeslotViewMode.FULL}
                            userStartersByTimeslot={userStartersByTimeslot}
                            oppStartersByTimeslot={oppStartersByTimeslot}
                        />
                    </div>
                </section >
            </PlayerModalContext.Provider>
            {
                showPlayerModal &&
                <PlayerModal
                    dismissPlayerModal={dismissPlayerModal}
                    playerId={playersInfo[selectedPlayerId]?.id}
                    avatarId={playersInfo[selectedPlayerId]?.avatarId}
                    playerName={`${playersInfo[selectedPlayerId]?.firstName} ${playersInfo[selectedPlayerId]?.lastName}`}
                    scores={isUserSelectedPlayer ? userLeagueInfo[selectedPlayerId]?.leagues : oppLeagueInfo[selectedPlayerId]?.leagues}
                />
            }
        </>
    )
};


export default Dashboard;