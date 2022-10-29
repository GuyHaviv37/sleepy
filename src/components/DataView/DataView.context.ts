import { ScheduleData } from '@/utils/schedule';
import { Starters } from '@/utils/sleeper';
import { createContext } from 'react';
import { PlayersInfo } from './consts';

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