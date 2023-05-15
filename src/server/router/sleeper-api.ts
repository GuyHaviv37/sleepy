import { z } from "zod";
import { createRouter } from "./context";
import { getSleeperUserLeagues, getSleeperUserRosterIds } from "@/features/leagues/data";

export const sleeperApiRouter = createRouter()
  .query("getLeagueRosterIds", {
    input: z.object({
      sleeperId: z.string()
    }).nullish(),
    async resolve({ input }) {
        const sleeperId = input?.sleeperId;
        if (!sleeperId) return {};
        const leagues = await getSleeperUserLeagues(sleeperId);
        const leagueIds = leagues.map(league => league.league_id);
        const leagueRosterIds = await getSleeperUserRosterIds(sleeperId, leagueIds);
        return leagueRosterIds;
    }
  });