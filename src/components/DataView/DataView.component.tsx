import type { Starters } from '@/utils/sleeper';
import type { ScheduleData } from '@/utils/schedule';
import React, { useMemo, useState } from 'react';
import { trpc } from '@/utils/trpc';
import PlayerModal from '../PlayerModal';
import { extractStartersByTimeslots, getStarterEmoji, getTimeslotString } from './utils';
import { PlayersInfo } from './consts';
import TimeslotStarters from './TimeslotStarters';

interface DataViewProps {
    userStarters: Starters;
    oppStarters: Starters;
    scheduleData: ScheduleData;
    leagueNames?: { [leagueId: string]: string };
    isByGameViewMode: boolean;
}


const DataView: React.FC<DataViewProps> = (props) => {
    const { userStarters, oppStarters, scheduleData, leagueNames, isByGameViewMode } = props;
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<{playerId: string; isUser: boolean}>({playerId: '', isUser: true});
    const openPlayerModal = (playerId: string, isUser?: boolean) => {
        setSelectedPlayer({playerId, isUser: !!isUser});
        setShowPlayerModal(true);
    };

    const userStarterIds = useMemo(() => Object.keys(userStarters), [userStarters]);
    const oppStarterIds = useMemo(() => Object.keys(oppStarters), [oppStarters]);
    const { data: playersInfo } = trpc.useQuery(
        ['players.getPlayersInfoByIds',
            { playerIds: [...userStarterIds, ...oppStarterIds] }]);
    const timeslots = Object.keys(scheduleData.byTimeslot).sort((a, b) => (new Date(a)).getTime() - (new Date(b)).getTime());
    const userStartersByTimeslots = extractStartersByTimeslots(scheduleData.byTeam, timeslots, userStarterIds, playersInfo)
    const oppStartersByTimeslots = extractStartersByTimeslots(scheduleData.byTeam, timeslots, oppStarterIds, playersInfo)
    const isLoadingData = !userStartersByTimeslots || !oppStartersByTimeslots || !playersInfo;
    const {playerId: selectedPlayerId, isUser: isUserSelectedPlayer} = selectedPlayer
    return isLoadingData ?
        null :
        (
            <section className='px-4 pt-3 grid grid-cols-2 gap-3 text-primary-text lg:px-6 lg:pt-6'>
                <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">You:</h6>
                <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">Opponent:</h6>
                <div className="grid grid-cols-2 col-span-2 gap-3">
                    {timeslots.map(timeslot => {
                        const TimeslotView = isByGameViewMode ? TimeslotByGameView : TimeslotFullView;
                        return (
                            <div className="col-span-2" key={timeslot}>
                                <p className="lg:text-lg underline pb-1 underline-offset-4 md:pb-2">🏈 {getTimeslotString(timeslot)}</p>
                                <TimeslotView
                                    timeslot={timeslot}
                                    userStarterIds={userStartersByTimeslots[timeslot] ?? []}
                                    oppStarterIds={oppStartersByTimeslots[timeslot] ?? []}
                                    playersInfo={playersInfo}
                                    userLeagueInfo={userStarters}
                                    oppLeagueInfo={oppStarters}
                                    scheduleData={scheduleData}
                                    openPlayerModal={openPlayerModal}
                                />
                            </div>
                        )
                    })}
                </div>
                {showPlayerModal &&
                    <PlayerModal
                        setOpenModal={setShowPlayerModal}
                        avatarId={playersInfo[selectedPlayerId]?.avatarId}
                        playerName={`${playersInfo[selectedPlayerId]?.firstName} ${playersInfo[selectedPlayerId]?.lastName}`}
                        scores={isUserSelectedPlayer ? userStarters[selectedPlayerId]?.leagues : oppStarters[selectedPlayerId]?.leagues}
                        leagueNames={leagueNames}
                    />}
            </section>
        )
};

interface TimeslotViewProps {
    timeslot: string;
    userStarterIds: string[];
    oppStarterIds: string[];
    playersInfo: PlayersInfo;
    userLeagueInfo: Starters;
    oppLeagueInfo: Starters;
    scheduleData: ScheduleData;
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
};

const TimeslotFullView: React.FC<TimeslotViewProps> = (props) => {
    const { timeslot, userStarterIds, oppStarterIds, userLeagueInfo, oppLeagueInfo, playersInfo, scheduleData, openPlayerModal } = props;
    return (
        <div className='grid grid-cols-2'>
            <TimeslotStarters
                key={`user_${timeslot}`}
                starterIds={userStarterIds}
                playersInfo={playersInfo}
                leagueInfo={userLeagueInfo}
                scheduleData={scheduleData}
                openPlayerModal={openPlayerModal}
                isUser
            />
            <TimeslotStarters
                key={`opp_${timeslot}`}
                starterIds={oppStarterIds}
                playersInfo={playersInfo}
                leagueInfo={oppLeagueInfo}
                scheduleData={scheduleData}
                openPlayerModal={openPlayerModal}
            />
        </div>
    )
}

const TimeslotByGameView: React.FC<TimeslotViewProps> = (props) => {
    const { timeslot, userStarterIds, oppStarterIds, userLeagueInfo, oppLeagueInfo, playersInfo, scheduleData, openPlayerModal } = props;
    const startersPerGame = scheduleData.byTimeslot[timeslot]?.map(game => {
        const userStartersPerGame = userStarterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            return playerTeam === game.homeTeam || playerTeam === game.awayTeam;
        })
        const oppStartersPerGame = oppStarterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            return playerTeam === game.homeTeam || playerTeam === game.awayTeam;
        })
        return {user: userStartersPerGame, opp: oppStartersPerGame};
    })
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
                        playersInfo={playersInfo}
                        leagueInfo={userLeagueInfo}
                        scheduleData={scheduleData}
                        openPlayerModal={openPlayerModal}
                        isByGameView
                        isUser
                    />
                    <TimeslotStarters
                        key={`opp_${timeslot}`}
                        starterIds={startersPerGame?.[index]?.opp ?? []}
                        playersInfo={playersInfo}
                        leagueInfo={oppLeagueInfo}
                        scheduleData={scheduleData}
                        openPlayerModal={openPlayerModal}
                        isByGameView
                    />
                </div>
            </div>
        )
    })}
    </div>
    )
}

export default DataView;