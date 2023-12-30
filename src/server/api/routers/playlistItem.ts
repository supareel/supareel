import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { YouTubeChannelDetails } from "@prisma/client";
import {
  type YoutubePlaylistItemsOuput,
  youtubePlaylistItemsInput,
  youtubePlaylistItemsOutput,
} from "~/schema/youtube_api";
import { getYTPlaylistVideosApi } from "../youtube/yt_playlistItem";
import axios from "axios";
import { TRPCError } from "@trpc/server";

export const playlistItemsRouter = createTRPCRouter({
  getUserUploadedVideos: publicProcedure
    .input(youtubePlaylistItemsInput)
    .output(youtubePlaylistItemsOutput)
    .query(async ({ ctx, input }): Promise<YoutubePlaylistItemsOuput> => {
      const { userId } = input;
      try {
        const dbResponse: YouTubeChannelDetails =
          await ctx.db.youTubeChannelDetails.findFirstOrThrow({
            where: {
              userId: userId,
            },
          });

        const playlistId = dbResponse.yt_channel_uploads_playlist_id;
        const __url = getYTPlaylistVideosApi(
          playlistId,
          dbResponse.access_token,
          ["snippet", "contentDetails"]
        );

        // header
        const response = await axios.get<YoutubePlaylistItemsOuput>(__url, {
          headers: {
            Authorization: `Bearer ${ctx.ytChannel?.access_token}`,
          },
        });
        // make api call
        return response.data;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unable to get youtube videos for this channel",
          cause: err,
        });
      }
    }),
});
