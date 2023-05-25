import React from 'react';
import { StartersByTimeslot, TimeslotViewMode } from './timeslot.types';
import { getTimeslotString } from '@/components/DataView/utils';
import { TimeslotByGameView, TimeslotFullView } from '../Dashboard';

interface TimeslotsProps {
    timeslots: string[];
    viewMode: TimeslotViewMode;
    userStartersByTimeslot: StartersByTimeslot;
    oppStartersByTimeslot: StartersByTimeslot;
}

const Timeslots: React.FC<TimeslotsProps> = (props) => {
    const {timeslots, viewMode, userStartersByTimeslot, oppStartersByTimeslot} = props;
    return (
        <>
            {timeslots.map(timeslot => {
                const TimeslotView = viewMode === TimeslotViewMode.BY_GAME ? TimeslotByGameView : TimeslotFullView;
                return (
                    <div className="col-span-2" key={timeslot}>
                        <p className="lg:text-lg underline pb-1 underline-offset-4 md:pb-2">🏈 {getTimeslotString(timeslot)}</p>
                        <TimeslotView
                            timeslot={timeslot}
                            userStarterIds={userStartersByTimeslot[timeslot] ?? []}
                            oppStarterIds={oppStartersByTimeslot[timeslot] ?? []}
                        />
                    </div>
                )
            })}
        </>
    )
};

export default Timeslots;