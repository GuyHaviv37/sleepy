import { extractStartersByTimeslot } from "./extractors";
import { useMemo, useContext } from "react";
import DashboardContext from "./DashboardContext";

export const useDashboardPresenter = () => {
    const { userLeagueInfo, oppLeagueInfo, scheduleData, playersInfo } = useContext(DashboardContext);

    const userStarterIds = useMemo(() => Object.keys(userLeagueInfo), [userLeagueInfo]);
    const oppStarterIds = useMemo(() => Object.keys(oppLeagueInfo), [oppLeagueInfo]);
    const timeslots = Object.keys(scheduleData.byTimeslot).sort((a, b) => (new Date(a)).getTime() - (new Date(b)).getTime());
    const userStartersByTimeslot = extractStartersByTimeslot(scheduleData.byTeam, timeslots, userStarterIds, playersInfo)
    const oppStartersByTimeslot = extractStartersByTimeslot(scheduleData.byTeam, timeslots, oppStarterIds, playersInfo)

    return {timeslots, userStartersByTimeslot, oppStartersByTimeslot};
}