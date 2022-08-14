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
        })
        return {...acc, [timeslot]: startersInTimeslot}
    }, {})
}

const DataView: React.FC<DataViewProps> = (props) => {
    const {userStarters, oppStarters, scheduleData} = props;
    console.log('userStarters', userStarters);
    const userStarterIds = useMemo(() => Object.keys(userStarters), [userStarters]);
    const oppStarterIds = useMemo(() => Object.keys(oppStarters), [oppStarters]);
    // get players personal info from DB
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
                <section className='px-4 pt-3 grid grid-cols-2 gap-3 text-primary-text'>
                    <h6 className="underline underline-offset-2">You:</h6>  
                    <h6 className="underline underline-offset-2">Opponent:</h6>
                    <div className="grid grid-cols-2 col-span-2 gap-3">
                    {timeslots.map(timeslot => {
                        // @TODO: improve date content
                        return (
                            <div className="col-span-2">
                                <p>{new Date(timeslot).toUTCString()}</p>
                                <div className='grid grid-cols-2'>
                                    <TimeslotStarters
                                    key={`user_${timeslot}`}
                                    starterIds={userStartersByTimeslots[timeslot] ?? []}
                                    timeslot={timeslot}
                                    playersInfo={playersInfo}
                                    leagueInfo={userStarters}
                                    />
                                    <TimeslotStarters
                                    key={`opp_${timeslot}`}
                                    starterIds={oppStartersByTimeslots[timeslot] ?? []}
                                    timeslot={timeslot}
                                    playersInfo={playersInfo}
                                    leagueInfo={oppStarters}
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
}

const TimeslotStarters: React.FC<TimeslotStartersProps> = (props) => {
    const {starterIds, timeslot, playersInfo, leagueInfo} = props;
    return (
        <div className="flex flex-col">
            { starterIds.map(starterId => {
                if (!playersInfo[starterId]) return null;
                return (
                    <StarterRow
                    firstName={playersInfo[starterId]?.firstName}
                    lastName={playersInfo[starterId]?.lastName}
                    position={playersInfo[starterId]?.position}
                    avatarId={playersInfo[starterId]?.avatarId}
                    team={playersInfo[starterId]?.team}
                    multipliers={Object.keys(leagueInfo[starterId]?.leagues ?? []).length}
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
}

const StarterRow: React.FC<StarterRowProps> = (props) => {
    const {position, firstName, lastName, team, multipliers, avatarId} = props;
    return (
        <p className="text-sm pb-1">
            {/* <img className="hidden sm:inline" 
            src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${avatarId}.png&w=100&h=80`}/> */}
            <span>{`${position} `}</span>
            <span className="hidden sm:inline">{`${firstName}\t\t`}</span>
            <span>{lastName}</span>
            {position !== 'DEF' && <span>{` ,${team}`}</span>}
            {multipliers && multipliers > 1 && <span>{` (X${multipliers})`}</span>}
        </p>
    )
};

export default DataView;