import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { youtubeRouter } from "./routers/yt_api";
import { channelDetailsRouter } from "./routers/channel";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  youtube: youtubeRouter,
  channel: channelDetailsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
