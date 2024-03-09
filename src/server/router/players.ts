import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from '@/server/db/client';
import type { Player } from "@prisma/client";

export const playersRouter = createRouter()
  .query("getPlayersInfoByIds", {
    input: z.object({
      playerIds: z.array(z.string())
    }).nullish(),
    async resolve({ input }) {
      const noDuplicatePlayerIds = Array.from(new Set(input?.playerIds ?? [])).map(id => Number(id));
      const playersInfo = await prisma.player.findMany({
        where: { id: { in: noDuplicatePlayerIds } }
      });
      const playersInfoById: Record<string, Omit<Player, "id"> & { id?: string }> = playersInfo.reduce((acc, player) => {
        return { ...acc, [player.id]: { ...player, team: player.team === 'WAS' ? 'WSH' : player.team, id: player.id?.toString() ?? '' } };
      }, {})
      return playersInfoById;
    }
  });
