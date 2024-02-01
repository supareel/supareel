import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type SavedYtChannelDetailsOutput,
  savedYtChannelDetailsInput,
  savedYtChannelDetailsOutput,
} from "~/server/api/routers/channel.types";
import type { YouTubeChannelDetails } from "@prisma/client";

export const channelDetailsRouter = createTRPCRouter({
  ytChannelDetails: publicProcedure
    .input(savedYtChannelDetailsInput)
    .output(savedYtChannelDetailsOutput)
    .query(async ({ ctx, input }): Promise<SavedYtChannelDetailsOutput> => {
      const { userId } = input;

      const dbResponse: YouTubeChannelDetails[] =
        await ctx.db.youTubeChannelDetails.findMany({
          where: {
            user_id: userId,
          },
        });

      const response: SavedYtChannelDetailsOutput = {
        channels: dbResponse.map((dbData: YouTubeChannelDetails) => {
          return {
            id: dbData.id ?? 0,
            yt_channel_id: dbData.yt_channel_id,
            yt_channel_title: dbData.yt_channel_title,
            yt_channel_thumbnails: dbData.yt_channel_thumbnails,
            yt_channel_customurl: dbData.yt_channel_customurl,
            yt_channel_published_at:
              dbData.yt_channel_published_at ?? undefined,
            user_id: dbData.user_id,
            subscriber_count: dbData.subscriber_count,
            video_count: dbData.video_count,
            view_count: dbData.view_count,
          };
        }),
      };

      // make api call
      return response;
    }),
});
