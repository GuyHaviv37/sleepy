import { createContext } from 'react';
import { PlayersInfo } from './consts';
import { Starters } from '@/features/leagues/leagues.types';
import { ScheduleData } from '@/features/schedule/schedule.types';

type DataViewContextType = {
    playersInfo: PlayersInfo;
    userLeagueInfo: Starters;
    oppLeagueInfo: Starters;
    scheduleData: ScheduleData;
    openPlayerModal: (playerId: string, isUser?: boolean) => void;
}

export default createContext<DataViewContextType>({
    playersInfo: {},
    userLeagueInfo: {},
    oppLeagueInfo: {},
    scheduleData: {byTeam: {}, byTimeslot: {}},
    openPlayerModal: () =>  {return;},
});