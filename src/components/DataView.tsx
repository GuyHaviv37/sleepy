import type { Starters } from '@/utils/sleeper';
import type { ScheduleData } from '@/utils/schedule';
import React, { useMemo, useState } from 'react';
import { inferQueryOutput, trpc } from '@/utils/trpc';
import PlayerModal from './PlayerModal';

interface DataViewProps {
    userStarters: Starters;
    oppStarters: Starters;
    scheduleData: ScheduleData
}

type PlayersInfo = inferQueryOutput<'example.getPlayersInfoByIds'>;

const POSITTION_ORDER = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

const computeWeekTimeslots = (scheduleData: ScheduleData): string[] => {
    const allTeamTimeslots = Object.values(scheduleData).map(teamGame => teamGame.timeslot ?? 'N/A');
    return Array.from(new Set(allTeamTimeslots)).filter(timeslot => timeslot !== 'N/A');
}
const extractStartersByTimeslots = (scheduleData: ScheduleData, timeslots: string[], starterIds: (keyof PlayersInfo)[], playersInfo?: PlayersInfo)
: {[timeslot: string]: string[]} | undefined => {
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
        return {...acc, [timeslot]: startersInTimeslot}
    }, {})
}

const getTimeslotString = (timeslot: string) => {
    const timeslotDate = new Date(timeslot);
    return timeslotDate.toLocaleString('en', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
}

const DataView: React.FC<DataViewProps> = (props) => {
    const {userStarters, oppStarters, scheduleData} = props;
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<string>('24');
    const openPlayerModal = (playerId: string) => {
        setSelectedPlayer(playerId);
        setShowPlayerModal(true);
    };
    
    const userStarterIds = useMemo(() => Object.keys(userStarters), [userStarters]);
    const oppStarterIds = useMemo(() => Object.keys(oppStarters), [oppStarters]);
    const {data: playersInfo} = trpc.useQuery(
        ['example.getPlayersInfoByIds',
        {playerIds: [...userStarterIds, ...oppStarterIds]}]);
    const timeslots = useMemo(() => computeWeekTimeslots(scheduleData), [scheduleData])
    const userStartersByTimeslots = extractStartersByTimeslots(scheduleData, timeslots, userStarterIds, playersInfo)
    const oppStartersByTimeslots = extractStartersByTimeslots(scheduleData, timeslots, oppStarterIds, playersInfo)
    const isLoadingData = !userStartersByTimeslots || !oppStartersByTimeslots || !playersInfo;
    return isLoadingData ? 
            (<div className="px-4"><p className="text-primary-text">Loading...</p></div>) :
            (
                <section className='px-4 pt-3 grid grid-cols-2 gap-3 text-primary-text lg:px-6 lg:pt-6'>
                    <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">You:</h6>  
                    <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">Opponent:</h6>
                    <div className="grid grid-cols-2 col-span-2 gap-3">
                    {timeslots.map(timeslot => {
                        // @TODO: improve date content
                        return (
                            <div className="col-span-2" key={timeslot}>
                                <p className="lg:text-lg underline pb-1 underline-offset-4 md:pb-2">🏈 {getTimeslotString(timeslot)}</p>
                                <div className='grid grid-cols-2'>
                                    <TimeslotStarters
                                    key={`user_${timeslot}`}
                                    starterIds={userStartersByTimeslots[timeslot] ?? []}
                                    playersInfo={playersInfo}
                                    leagueInfo={userStarters}
                                    scheduleData={scheduleData}
                                    openPlayerModal={openPlayerModal}
                                    isUser
                                    />
                                    <TimeslotStarters
                                    key={`opp_${timeslot}`}
                                    starterIds={oppStartersByTimeslots[timeslot] ?? []}
                                    playersInfo={playersInfo}
                                    leagueInfo={oppStarters}
                                    scheduleData={scheduleData}
                                    openPlayerModal={openPlayerModal}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    </div>
                    {showPlayerModal && 
                    <PlayerModal 
                        setOpenModal={setShowPlayerModal}
                        avatarId={playersInfo[selectedPlayer]?.avatarId}
                        playerName={`${playersInfo[selectedPlayer]?.firstName} ${playersInfo[selectedPlayer]?.lastName}`}
                        scores={userStarters[selectedPlayer]?.leagues ?? oppStarters[selectedPlayer]?.leagues}
                    />}
                </section>
            )
};

interface TimeslotStartersProps {
    starterIds: string[];
    playersInfo: PlayersInfo;
    leagueInfo: Starters;
    scheduleData: ScheduleData;
    openPlayerModal: (playerId: string) => void;
    isUser?: boolean;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const {starterIds, playersInfo, leagueInfo, scheduleData, isUser, openPlayerModal} = props;
    return (
        <div className="flex flex-col lg:items-center">
            { starterIds.map(starterId => {
                if (!playersInfo[starterId]) return null;
                const playerTeam = playersInfo[starterId]?.team;
                const oppTeam = playerTeam ? scheduleData[playerTeam]?.oppTeam : undefined;
                const isHome = playerTeam ? scheduleData[playerTeam]?.isHomeTeam : undefined;
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
                    />
                )})
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
    openPlayerModal: (playerId: string) => void;
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
    const {id, position, firstName, lastName, team, multipliers, isConflicted, oppTeam, isHome, isUser: isUserTeam, openPlayerModal} = props;
    const starterEmoji = getStarterEmoji(multipliers, isConflicted, isUserTeam);
    return (
        <div className='flex items-center cursor-pointer' onClick={() => openPlayerModal(id)}>
            <p className="text-sm pb-1 md:text-base lg:text-lg lg:self-end">
                <span className={`pr-1 lg:pr-2`}>{starterEmoji}</span>
                <span className={starterEmoji ? 'font-bold' : ''}>
                    <span>{`${position} `}</span>
                    <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                    <span>{lastName}</span>
                    {position !== 'DEF' && <span>{` ,${team}`}</span>}
                    {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>}
                    <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>
                </span>
            </p>
        </div>
    )
};

export default DataView;