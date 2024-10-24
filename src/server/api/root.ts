import { authRouter } from "@/server/api/routers/auth.router";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user.router";
import { announcementRouter } from "./routers/announcement.router";
import { groupRouter } from "./routers/group.router";
import { eventRouter } from "./routers/event.router";
import { awsRouter } from "./routers/aws.router";
import { rsvpRouter } from "./routers/rsvp.router";
import { genralRouter } from "./routers/genral.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  announcement: announcementRouter,
  group: groupRouter,
  event: eventRouter,
  aws: awsRouter,
  rsvp: rsvpRouter,
  genral: genralRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
