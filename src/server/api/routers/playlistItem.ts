import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { YouTubeChannelDetails, YouTubeVideo } from "@prisma/client";
import { youtubePlaylistItemsInput } from "~/schema/youtube_api";
import {
  type YTPlaylistVideosApiResponse,
  getYTPlaylistVideosApi,
  ytPlaylistVideosApiResponse,
} from "../youtube/yt_playlistItem";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import {
  type YTVideoCommentsApiResponse,
  getYTVideoCommentsApi,
} from "../youtube/yt_comments";
import {
  type YoutubePlaylistItemsOutput,
  youtubePlaylistItemsOutput,
} from "./playlistItem.types";

export const playlistItemsRouter = createTRPCRouter({
  getUserUploadedVideos: publicProcedure
    .input(youtubePlaylistItemsInput)
    .output(youtubePlaylistItemsOutput)
    .query(async ({ ctx, input }): Promise<YoutubePlaylistItemsOutput> => {
      const { userId } = input;
      const dbSavedYtVideosResponse: YouTubeVideo[] =
        await ctx.db.youTubeVideo.findMany({
          where: {
            user_id: userId,
          },
        });
      return dbSavedYtVideosResponse;
    }),
  saveUserUploadedVideos: publicProcedure
    .input(youtubePlaylistItemsInput)
    .output(ytPlaylistVideosApiResponse)
    .query(async ({ ctx, input }): Promise<YTPlaylistVideosApiResponse> => {
      const { userId, ytChannelId } = input;
      try {
        const dbResponse: YouTubeChannelDetails =
          await ctx.db.youTubeChannelDetails.findFirstOrThrow({
            where: {
              userId: userId,
              yt_channel_id: ytChannelId,
            },
          });

        const playlistId = dbResponse.yt_channel_uploads_playlist_id;
        const __url = getYTPlaylistVideosApi(
          playlistId,
          dbResponse.access_token,
          ["snippet", "contentDetails"]
        );
        // header
        const response = await axios.get<YTPlaylistVideosApiResponse>(__url, {
          headers: {
            Authorization: `Bearer ${ctx.ytChannel?.access_token}`,
          },
        });
        // save the youtube videos
        const __data__ = response.data.items.map((dat) => ({
          user_id: userId,
          yt_channel_id: dat.snippet.channelId ?? "",
          yt_video_id: dat.id,
        }));
        const _ = await ctx.db.youTubeVideo.createMany({
          data: __data__,
        });

        const dbSavedYtVideosResponse: YouTubeVideo[] =
          await ctx.db.youTubeVideo.findMany({
            where: {
              user_id: userId,
            },
          });

        const userChannelVideosId = dbSavedYtVideosResponse.map((e) =>
          String(e.yt_video_id)
        );

        const __comments_url = getYTVideoCommentsApi(
          userChannelVideosId,
          dbResponse.access_token,
          ["snippet", "replies"]
        );

        // // header
        const comment_response = await axios.get<YTVideoCommentsApiResponse>(
          __comments_url,
          {
            headers: {
              Authorization: `Bearer ${ctx.ytChannel?.access_token}`,
            },
          }
        );

        // filter out all the comments
        comment_response.data.items.map(async (dat) => {
          let comments: { text: string; videoId: string }[] = [];
          comments = [
            {
              text: dat.snippet.topLevelComment.snippet.textDisplay,
              videoId: dat.snippet.videoId,
            },
            ...dat.replies.comments.map((reply) => ({
              text: reply.snippet.textDisplay,
              videoId: reply.snippet.videoId,
            })),
          ];

          // save all comments
          console.log(comments);
          const data = comments.map((dat) => ({
            text: dat.text,
            yt_video_id: dat.videoId,
            emojis: "",
          }));
          await ctx.db.youTubeComments.createMany({
            data: data,
          });
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
