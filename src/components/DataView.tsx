import type { Starters } from '@/utils/sleeper';
import type { ScheduleData } from '@/utils/schedule';
import React, { useMemo } from 'react';
import { inferQueryOutput, trpc } from '@/utils/trpc';

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

const DataView: React.FC<DataViewProps> = (props) => {
    const {userStarters, oppStarters, scheduleData} = props;
    console.log('userStarters', userStarters);
    const userStarterIds = useMemo(() => Object.keys(userStarters), [userStarters]);
    const oppStarterIds = useMemo(() => Object.keys(oppStarters), [oppStarters]);
    const {data: playersInfo} = trpc.useQuery(
        ['example.getPlayersInfoByIds',
        {playerIds: Array.from(new Set([...userStarterIds, ...oppStarterIds]))}]);
    const timeslots = useMemo(() => computeWeekTimeslots(scheduleData), [scheduleData])
    const userStartersByTimeslots = extractStartersByTimeslots(scheduleData, timeslots, userStarterIds, playersInfo)
    const oppStartersByTimeslots = extractStartersByTimeslots(scheduleData, timeslots, oppStarterIds, playersInfo)
    const isLoadingData = !userStartersByTimeslots || !oppStartersByTimeslots || !playersInfo;
    return isLoadingData ? 
            (<div>Loading..</div>) :
            (
                <section className='px-4 pt-3 grid grid-cols-2 gap-3 text-primary-text lg:px-6 lg:pt-6'>
                    <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">You:</h6>  
                    <h6 className="underline underline-offset-2 md:text-lg md:underline-offset-4">Opponent:</h6>
                    <div className="grid grid-cols-2 col-span-2 gap-3">
                    {timeslots.map(timeslot => {
                        // @TODO: improve date content
                        return (
                            <div className="col-span-2">
                                <p className="lg:text-lg underline underline-offset-2 md:pb-2">{new Date(timeslot).toUTCString()}</p>
                                <div className='grid grid-cols-2'>
                                    <TimeslotStarters
                                    key={`user_${timeslot}`}
                                    starterIds={userStartersByTimeslots[timeslot] ?? []}
                                    timeslot={timeslot}
                                    playersInfo={playersInfo}
                                    leagueInfo={userStarters}
                                    scheduleData={scheduleData}
                                    />
                                    <TimeslotStarters
                                    key={`opp_${timeslot}`}
                                    starterIds={oppStartersByTimeslots[timeslot] ?? []}
                                    timeslot={timeslot}
                                    playersInfo={playersInfo}
                                    leagueInfo={oppStarters}
                                    scheduleData={scheduleData}
                                    />
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </section>
            )
};

interface TimeslotStartersProps {
    timeslot: string;
    starterIds: string[];
    playersInfo: PlayersInfo;
    leagueInfo: Starters;
    scheduleData: ScheduleData;
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const {starterIds, timeslot, playersInfo, leagueInfo, scheduleData} = props;
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
                    firstName={playersInfo[starterId]?.firstName}
                    lastName={playersInfo[starterId]?.lastName}
                    position={playersInfo[starterId]?.position}
                    avatarId={playersInfo[starterId]?.avatarId}
                    team={playerTeam}
                    multipliers={Object.keys(leagueInfo[starterId]?.leagues ?? []).length}
                    isConflicted={leagueInfo[starterId]?.isConflicted}
                    oppTeam={oppTeam}
                    isHome={isHome}
                    />
                )})
            }
        </div>
    )
}

// @TODO: work out scores UI
interface StarterRowProps {
    firstName?: string;
    lastName?: string;
    position?: string | null;
    avatarId?: string | null;
    team?: string | null;
    multipliers?: number;
    isConflicted?: boolean;
    oppTeam?: string;
    isHome?: boolean;
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const {position, firstName, lastName, team, multipliers, avatarId, isConflicted, oppTeam, isHome} = props;
    return (
        <p className="text-sm pb-1 md:text-base lg:text-lg">
            {/* <img className="hidden sm:inline" 
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${avatarId}.png&w=100&h=80`}/> */}
            <span className={`pr-1 lg:pr-2 ${isConflicted ? 'inline' : 'hidden'}`}>&#9876;</span>
            <span className={isConflicted ? 'font-bold' : ''}>
                <span>{`${position} `}</span>
                <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
                <span>{lastName}</span>
                {position !== 'DEF' && <span>{` ,${team}`}</span>}
                {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>}
                <span className="hidden md:inline md:pl-1 lg:pl-2">{isHome ? 'vs.' : '@'}{'\t'}{oppTeam}</span>
            </span>
        </p>
    )
};

export default DataView;