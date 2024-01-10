import { createTRPCRouter } from "~/server/api/trpc";
import { youtubeRouter } from "./routers/yt_api";
import { channelDetailsRouter } from "./routers/channel";
import { playlistItemsRouter } from "./routers/playlistItem";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  youtube: youtubeRouter,
  channel: channelDetailsRouter,
  playlistItem: playlistItemsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
