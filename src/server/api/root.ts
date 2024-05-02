import { sessionRouter } from "~/server/api/routers/session";
import { notesRouter } from "~/server/api/routers/note";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: sessionRouter,
  note: notesRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
