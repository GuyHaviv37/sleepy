import { createRouter } from "./context";
import { z } from "zod";

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .mutation('createUser', {
    input: z.object({
      sleeperId: z.string(),
      username: z.string(),
    }),
    async resolve({input}) {
      const createdUser = await prisma?.user.create({
        data: {
          sleeperId: input.sleeperId,
          username: input.username,
        }
      });
      console.log('Created user:', createdUser);
      return {success: true, createdUser};
    }
  })
  .mutation('updateUserScales', {
    input: z.object({
      sleeperId: z.string(),
      scales: z.array(z.object({
        scale: z.number(),
        leagueId: z.string(),
      })),
    }),
    async resolve({input}) {
      const {sleeperId, scales} = input;
      console.log('sleeperId', sleeperId);
      console.log('scales:', scales);
      const updatedUser = await prisma?.user.update({
        where: {
          sleeperId,
        },
        data: {
          scales,
        }
      })
      console.log('Updated User: ', updatedUser);
      return {success: true, updatedUser};
    }
  });
