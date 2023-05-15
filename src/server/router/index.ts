// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { playersRouter } from "./players";
import { sleeperApiRouter } from "./sleeper-api";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("players.", playersRouter)
  .merge("sleeper-api.", sleeperApiRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
