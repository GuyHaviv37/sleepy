import { z } from "zod";
import { createRouter } from "./context";
import { getSleeperUserLeagues, getSleeperUserMatchupsData, getSleeperUserRosterIds } from "@/features/leagues/data";
import { extractSleeperMatchupData } from "@/features/leagues/extractors";
import { WEEKS } from "@/utils/consts";
import { getMockDrafts } from "@/features/mock-drafts/data";

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
  })
  .query("getMatchupsData", {
    input: z.object({
      leagueRosterIds: z.record(z.number()),
      week: z.string(),
      closeMatchupMargin: z.number().nullish()
    }).nullish(),
    async resolve({input}) {
      const leagueRosterIds = input?.leagueRosterIds;
      const week = input?.week;
      if (!leagueRosterIds || !week) return {};
      const leagueIds = Object.keys(leagueRosterIds);
      const closeMatchupMargin = input?.closeMatchupMargin;
      const leagueMatchupData = await getSleeperUserMatchupsData(leagueIds, week as WEEKS);
      return extractSleeperMatchupData(leagueMatchupData, leagueRosterIds, closeMatchupMargin);
    }
  })
  .query("getMockDraftsData", {
    input: z.object({
      mockDraftIds: z.array(z.string())
    }).nullish(),
    async resolve({input}) {
      const mockDraftIds = input?.mockDraftIds;
      if (!mockDraftIds) return {};
      const mockDraftData = await getMockDrafts(mockDraftIds);
      return mockDraftData;
    }
  });