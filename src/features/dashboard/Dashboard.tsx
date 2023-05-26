import React, { useContext } from 'react';
import DashboardContext from './DashboardContext';
import PlayerModal from '@/features/dashboard/player-modal/PlayerModal';
import { usePlayerModal } from '@/features/dashboard/player-modal/usePlayerModal';
import { useDashboardPresenter } from './useDashboardPresenter';
import PlayerModalContext from './player-modal/PlayerModalContext';
import Timeslots from './timeslots/Timeslots';
import { TimeslotViewMode } from './timeslots/timeslot.types';

interface DashboardProps {
    isByGameViewMode: boolean;
}


const Dashboard: React.FC<DashboardProps> = (props) => {
    const {playersInfo, userLeagueInfo, oppLeagueInfo} = useContext(DashboardContext);
    const {isByGameViewMode} = props;
    // @TODO: compile highlighted players from userStarters/oppStarters in useDashboardPresenter
    const {timeslots, userStartersByTimeslot, oppStartersByTimeslot} = useDashboardPresenter();
    const {selectedPlayer, showPlayerModal, openPlayerModal, dismissPlayerModal} = usePlayerModal()
    const { playerId: selectedPlayerId, isUser: isUserSelectedPlayer } = selectedPlayer
    
    return (
            <section className='px-4 pt-3 grid grid-cols-2 gap-3 text-primary-text lg:px-6 lg:pt-6'>
                <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">You:</h6>
                <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">Opponent:</h6>
                {/* HIGHLIGHTED PLAYERS */}
                <div className="grid grid-cols-2 col-span-2 gap-3">
                    <PlayerModalContext.Provider value={{openPlayerModal}}>
                        <Timeslots timeslots={timeslots}
                        viewMode={isByGameViewMode ? TimeslotViewMode.BY_GAME : TimeslotViewMode.FULL}
                        userStartersByTimeslot={userStartersByTimeslot}
                        oppStartersByTimeslot={oppStartersByTimeslot}
                        />
                    </PlayerModalContext.Provider>
                </div>
                {showPlayerModal &&
                    <PlayerModal
                        dismissPlayerModal={dismissPlayerModal}
                        playerId={playersInfo[selectedPlayerId]?.id}
                        avatarId={playersInfo[selectedPlayerId]?.avatarId}
                        playerName={`${playersInfo[selectedPlayerId]?.firstName} ${playersInfo[selectedPlayerId]?.lastName}`}
                        scores={isUserSelectedPlayer ? userLeagueInfo[selectedPlayerId]?.leagues : oppLeagueInfo[selectedPlayerId]?.leagues}
                    />}
            </section>
        )
};


export default Dashboard;