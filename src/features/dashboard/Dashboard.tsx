import React, { useContext } from 'react';
import { getStartersByGame, getTimeslotString } from '../../components/DataView/utils';
import TimeslotStarters from '../../components/DataView/TimeslotStarters';
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
    // @TODO: move playersInfo, scheduleData, userStarters, oppStarters to context in upper level & consume in PlayerModal
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

// @TODO: Move to different files

interface TimeslotViewProps {
    timeslot: string;
    userStarterIds: string[];
    oppStarterIds: string[];
};

export const TimeslotFullView: React.FC<TimeslotViewProps> = (props) => {
    const { timeslot, userStarterIds, oppStarterIds } = props;
    return (
        <div className='grid grid-cols-2'>
            <TimeslotStarters
                key={`user_${timeslot}`}
                starterIds={userStarterIds}
                isUser
            />
            <TimeslotStarters
                key={`opp_${timeslot}`}
                starterIds={oppStarterIds}
            />
        </div>
    )
}

export const TimeslotByGameView: React.FC<TimeslotViewProps> = (props) => {
    const { timeslot, userStarterIds, oppStarterIds } = props;
    const { playersInfo, scheduleData } = useContext(DashboardContext);
    const startersPerGame = getStartersByGame(scheduleData, timeslot, userStarterIds, oppStarterIds, playersInfo);

    return (
        <div className="col-span-2" key={timeslot}>
            {scheduleData.byTimeslot[timeslot]?.map((game, index) => {
                return (
                    <div className="col-span-2" key={`${timeslot}_game_${game.homeTeam}`}>
                        <p className="text-sm md:text-base xl:text-lg pb-1 md:pb-2 italic"> - <span className='underline pb-1 underline-offset-4'>{game.awayTeam} @ {game.homeTeam}</span></p>
                        <div className='grid grid-cols-2'>
                            <TimeslotStarters
                                key={`user_${timeslot}`}
                                starterIds={startersPerGame?.[index]?.user ?? []}
                                isByGameView
                                isUser
                            />
                            <TimeslotStarters
                                key={`opp_${timeslot}`}
                                starterIds={startersPerGame?.[index]?.opp ?? []}
                                isByGameView
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Dashboard;