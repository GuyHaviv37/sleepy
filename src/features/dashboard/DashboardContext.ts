import { createContext } from 'react';
import { PlayersInfo } from './consts';
import { Starters } from '@/features/leagues/leagues.types';
import { ScheduleData } from '@/features/schedule/schedule.types';

type DashboardContextType = {
    playersInfo: PlayersInfo;
    userLeagueInfo: Starters;
    oppLeagueInfo: Starters;
    scheduleData: ScheduleData;
}

export default createContext<DashboardContextType>({
    playersInfo: {},
    userLeagueInfo: {},
    oppLeagueInfo: {},
    scheduleData: {byTeam: {}, byTimeslot: {}},
});