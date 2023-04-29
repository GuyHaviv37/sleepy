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
      const noDuplicatePlayerIds = Array.from(new Set(input?.playerIds ?? []));
      const playersInfo = await prisma.player.findMany({
        where: {id: {in: noDuplicatePlayerIds} }
      });
      const playersInfoById: Record<string, Player> = playersInfo.reduce((acc, player) => {
        return {...acc, [player.id]: player};
      }, {})
      return playersInfoById;
    }
  });
