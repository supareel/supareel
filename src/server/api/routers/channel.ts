import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type SavedYtChannelDetailsOutput,
  savedYtChannelDetailsInput,
  savedYtChannelDetailsOutput,
} from "~/schema/youtube";
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
            userId: userId,
          },
        });

      const response: SavedYtChannelDetailsOutput = {
        channels: dbResponse.map((dbData: YouTubeChannelDetails) => {
          return {
            id: dbData.id,
            yt_channel_id: dbData.yt_channel_id ?? "",
            yt_channel_title: dbData.yt_channel_title ?? "",
            yt_channel_thumbnails: dbData.yt_channel_thumbnails ?? "",
            yt_channel_customurl: dbData.yt_channel_customurl ?? "",
            yt_channel_uploads_playlist_id:
              dbData.yt_channel_uploads_playlist_id,
            yt_channel_published_at:
              dbData.yt_channel_published_at ?? undefined,
            userId: dbData.userId ?? "",
            access_token: dbData.access_token ?? "",
            refresh_token: dbData.refresh_token ?? "",
            id_token: dbData.id_token ?? "",
            expiry_date: dbData.expiry_date,
          };
        }),
      };

      // make api call
      return response;
    }),
});
