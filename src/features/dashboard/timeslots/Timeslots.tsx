import React from 'react';
import { StartersByTimeslot, TimeslotViewMode } from './timeslot.types';
import { TimeslotByGameView, TimeslotFullView } from './TimeslotView';
import { getTimeslotString } from './content-utils';

interface TimeslotsProps {
    timeslots: string[];
    viewMode: TimeslotViewMode;
    userStartersByTimeslot: StartersByTimeslot;
    oppStartersByTimeslot: StartersByTimeslot;
}

const Timeslots: React.FC<TimeslotsProps> = (props) => {
    const { timeslots, viewMode, userStartersByTimeslot, oppStartersByTimeslot } = props;
    return (
        <>
            {timeslots.map(timeslot => {
                const TimeslotView = viewMode === TimeslotViewMode.BY_GAME ? TimeslotByGameView : TimeslotFullView;
                const userStarterIds = userStartersByTimeslot[timeslot] ?? [];
                const oppStarterIds = oppStartersByTimeslot[timeslot] ?? [];
                if (userStarterIds.length === 0 && oppStarterIds.length === 0) return null;
                return (
                    <div className="col-span-2" key={timeslot}>
                        <p className="lg:text-lg pb-1 md:pb-2">📅 {getTimeslotString(timeslot)}</p>
                        <TimeslotView
                            timeslot={timeslot}
                            userStarterIds={userStarterIds}
                            oppStarterIds={oppStarterIds}
                        />
                    </div>
                )
            })}
        </>
    )
};

export default Timeslots;