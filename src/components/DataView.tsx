import type { Starters } from '@/utils/sleeper';
import type { ScheduleData } from '@/utils/schedule';
import React, { useMemo, useState } from 'react';
import { inferQueryOutput, trpc } from '@/utils/trpc';
import PlayerModal from './PlayerModal';

interface DataViewProps {
    userStarters: Starters;
    oppStarters: Starters;
    scheduleData: ScheduleData;
    leagueNames?: { [leagueId: string]: string };
    isByGameViewMode: boolean;
}

type PlayersInfo = inferQueryOutput<'example.getPlayersInfoByIds'>;

const POSITTION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

const extractStartersByTimeslots = (scheduleData: ScheduleData['byTeam'], timeslots: string[], starterIds: string[], playersInfo?: PlayersInfo)
    : { [timeslot: string]: string[] } | undefined => {
    if (!playersInfo) return;
    return timeslots.reduce((acc, timeslot) => {
        const startersInTimeslot = starterIds.filter(starterId => {
            const playerTeam = playersInfo[starterId]?.team;
            if (!playerTeam) return false;
            const teamTimeslot = scheduleData[playerTeam]?.timeslot;
            return teamTimeslot === timeslot;
        }).sort((playerA, playerB) => {
            return POSITTION_ORDER.indexOf(playersInfo[playerA]?.position ?? '') -
                POSITTION_ORDER.indexOf(playersInfo[playerB]?.position ?? '')
        })
        return { ...acc, [timeslot]: startersInTimeslot }
    }, {})
}

const getTimeslotString = (timeslot: string) => {
    const timeslotDate = new Date(timeslot);
    return timeslotDate.toLocaleString('en', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
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
        ['example.getPlayersInfoByIds',
            { playerIds: [...userStarterIds, ...oppStarterIds] }]);
    const timeslots = Object.keys(scheduleData.byTimeslot);
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

interface TimeslotStartersProps {
    starterIds: string[];
    playersInfo: PlayersInfo;
    leagueInfo: Starters;
    scheduleData: ScheduleData;
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
    isUser?: boolean;
    isByGameView?: boolean;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const { starterIds, playersInfo, leagueInfo, scheduleData, isUser, openPlayerModal, isByGameView } = props;
    return (
        <div className="flex flex-col lg:items-center">
            {starterIds.map(starterId => {
                if (!playersInfo[starterId]) return null;
                const playerTeam = playersInfo[starterId]?.team;
                const oppTeam = playerTeam ? scheduleData.byTeam[playerTeam]?.oppTeam : undefined;
                const isHome = playerTeam ? scheduleData.byTeam[playerTeam]?.isHomeTeam : undefined;
                return (
                    <StarterRow
                        key={starterId}
                        id={starterId}
                        firstName={playersInfo[starterId]?.firstName}
                        lastName={playersInfo[starterId]?.lastName}
                        position={playersInfo[starterId]?.position}
                        team={playerTeam}
                        multipliers={Object.keys(leagueInfo[starterId]?.leagues ?? []).length}
                        isConflicted={leagueInfo[starterId]?.isConflicted}
                        oppTeam={oppTeam}
                        isHome={isHome}
                        isUser={isUser}
                        openPlayerModal={openPlayerModal}
                        isByGameView={isByGameView}
                    />
                )
            })
            }
        </div>
    )
}

// @TODO: work out scores UI
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
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
    isByGameView?: boolean;
}

const SWORDS_EMOJI = '⚔';
const THUNDER_EMOJI = '⚡';
const THUMBS_DOWN_EMOJI = '👎';

const getStarterEmoji = (multipliers?: number, isConflicted?: boolean, isUserTeam?: boolean) => {
    if (isConflicted) return SWORDS_EMOJI;
    const isUnconflictedMultiplier = multipliers && multipliers > 1 && !isConflicted;
    const isRoot = isUnconflictedMultiplier && isUserTeam;
    if (isRoot) return THUNDER_EMOJI;
    const isBoo = isUnconflictedMultiplier && !isUserTeam;
    if (isBoo) return THUMBS_DOWN_EMOJI;
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const { id, position, firstName, lastName, team, multipliers, isConflicted, oppTeam, isHome, isUser: isUserTeam, openPlayerModal, isByGameView } = props;
    const starterEmoji = getStarterEmoji(multipliers, isConflicted, isUserTeam);
    return (
        <div className='flex items-center cursor-pointer' onClick={() => openPlayerModal(id, isUserTeam)}>
            <p className="text-sm pb-1 md:text-base lg:text-lg lg:self-end">
                <span className={`pr-1 lg:pr-2`}>{starterEmoji}</span>
                <span className={starterEmoji ? 'font-bold' : ''}>
                    <span>{`${position} `}</span>
                    <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                    <span>{lastName}</span>
                    {position !== 'DEF' && <span>{` ,${team}`}</span>}
                    {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>}
                    {isByGameView ? null : <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>}
                </span>
            </p>
        </div>
    )
};

export default DataView;