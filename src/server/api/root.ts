import { createTRPCRouter } from "~/server/api/trpc";
import { channelDetailsRouter } from "./routers/channel";
import { videoRouter } from "./routers/video";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  channel: channelDetailsRouter,
  video: videoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
