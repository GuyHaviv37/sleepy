// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { playersRouter } from "./players";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("players.", playersRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
