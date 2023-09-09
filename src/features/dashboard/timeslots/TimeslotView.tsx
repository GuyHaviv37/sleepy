import { useContext } from "react";
import DashboardContext from "../DashboardContext";
import TimeslotStarters from "./starters/TimeslotStarters";
import { extractStartersByGame } from "../extractors";

interface TimeslotViewProps {
    timeslot: string;
    userStarterIds: string[];
    oppStarterIds: string[];
};

export const TimeslotFullView: React.FC<TimeslotViewProps> = (props) => {
    const { timeslot, userStarterIds, oppStarterIds } = props;
    return (
        <div className='grid grid-cols-2 gap-3 md:gap-16'>
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
    const startersPerGame = extractStartersByGame(scheduleData, timeslot, userStarterIds, oppStarterIds, playersInfo);

    return (
        <div className="col-span-2" key={timeslot}>
            {scheduleData.byTimeslot[timeslot]?.map((game, index) => {
                const userStarterIds = startersPerGame?.[index]?.user ?? [];
                const oppStarterIds = startersPerGame?.[index]?.opp ?? [];
                if (userStarterIds.length === 0 && oppStarterIds.length === 0) return null;
                return (
                    <div className="col-span-2" key={`${timeslot}_game_${game.homeTeam}`}>
                        <p className="text-sm md:text-base xl:text-lg pb-1 md:pb-2 italic"><span className='pb-1'>{game.awayTeam} @ {game.homeTeam}</span></p>
                        <div className='grid grid-cols-2 gap-3 mb-3 md:gap-16'>
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