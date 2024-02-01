/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  YouTubeChannelDetails,
  YouTubeComments,
  YouTubeVideo,
} from "@prisma/client";
import { youtubePlaylistItemsInput } from "~/schema/youtube_api";
import {
  type YTPlaylistVideosApiResponse,
  getYTPlaylistVideosApi,
  ytPlaylistVideosApiResponse,
} from "../youtube/yt_playlistItem";
import MindsDB, { type SqlQueryResult } from "mindsdb-js-sdk";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import {
  type YoutubePlaylistItemsOutput,
  youtubePlaylistItemsOutput,
} from "./playlistItem.types";
import {
  type SavedYtCommentOutput,
  savedYtCommentOutput,
  savedYtVideoInput,
  savedYtVideoOutput,
  type SavedYtVideoOutput,
} from "~/server/api/routers/video.types";
import { analyseComments } from "./mindsdb";

export const videoRouter = createTRPCRouter({
  getUserUploadedVideos: publicProcedure
    .input(youtubePlaylistItemsInput)
    .output(youtubePlaylistItemsOutput)
    .query(async ({ ctx, input }): Promise<YoutubePlaylistItemsOutput> => {
      const { ytChannelId } = input;
      const dbSavedYtVideosResponse: YouTubeVideo[] =
        await ctx.db.youTubeVideo.findMany({
          where: {
            yt_channel_id: ytChannelId,
          },
        });
      return dbSavedYtVideosResponse;
    }),
  syncMyUploadedVideos: publicProcedure
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
        response.data.items[0]?.contentDetails.videoId;
        // save the youtube videos
        const __data__ = response.data.items.map((dat) => ({
          user_id: userId,
          yt_channel_id: dat.snippet.channelId ?? "",
          yt_video_id: dat.contentDetails.videoId,
          yt_video_title: dat.snippet.title,
          yt_video_description: dat.snippet.description,
          yt_video_thumbnail: dat.snippet.thumbnails.medium.url,
        }));

        await Promise.all(
          __data__.map(async (ytVid) => {
            await ctx.db.youTubeVideo.upsert({
              where: {
                yt_video_id: ytVid.yt_video_id,
              },
              update: {
                yt_video_title: ytVid.yt_video_title.toString() ?? "",
                yt_video_description:
                  ytVid.yt_video_description.toString() ?? "",
                yt_video_thumbnail: ytVid.yt_video_thumbnail.toString() ?? "",
              },
              create: ytVid,
            });
          })
        );

        return response.data;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unable to get youtube videos for this channel",
          cause: err,
        });
      }
    }),

  // ytVideoDetails: publicProcedure
  //   .input(savedYtVideoInput)
  //   .output(savedYtVideoOutput)
  //   .query(async ({ ctx, input }): Promise<SavedYtVideoOutput> => {
  //     const dbVideoResponse = await ctx.db.youTubeVideo.findFirstOrThrow({
  //       where: {
  //         yt_video_id: input.videoId,
  //       },
  //     });

  //     const dbChannelResponse =
  //       await ctx.db.youTubeChannelDetails.findFirstOrThrow({
  //         where: {
  //           yt_channel_id: dbVideoResponse.yt_channel_id,
  //         },
  //       });

  //     const dbCommentsResponse = await ctx.db.youTubeComments.findMany({
  //       where: {
  //         yt_video_id: input.videoId,
  //       },
  //     });

  //     return {
  //       id: dbVideoResponse.id,
  //       yt_channel: {
  //         title: dbChannelResponse.yt_channel_title ?? "",
  //         thumbnail: dbChannelResponse.yt_channel_thumbnails ?? "",
  //       },
  //       yt_video_description: dbVideoResponse.yt_video_description,
  //       yt_video_id: dbVideoResponse.yt_video_id,
  //       yt_video_thumbnail: dbVideoResponse.yt_video_thumbnail,
  //       yt_video_title: dbVideoResponse.yt_video_title,
  //       yt_video_comments: dbCommentsResponse.map((cmt) => ({
  //         text: cmt.comment,
  //         mood: cmt.mood,
  //       })),
  //     };
  //   }),
  ytVideoDetailsByVideoId: publicProcedure
    .input(savedYtVideoInput)
    .output(savedYtVideoOutput)
    .query(async ({ input }): Promise<SavedYtVideoOutput> => {
      const videoDetailQuery = `SELECT channel_id, channel_title, title, description, publish_time,
      comment_count,like_count, view_count, video_id 
      FROM supareel_db.videos WHERE video_id = '${input.videoId}';`;
      try {
        const videoDetailResult: SqlQueryResult = await MindsDB.SQL.runQuery(
          videoDetailQuery
        );

        const videoResult = {
          channel_id: String(videoDetailResult.rows[0]?.channel_id),
          channel_title: String(videoDetailResult.rows[0]?.channel_title),
          title: String(videoDetailResult.rows[0]?.title),
          description: String(videoDetailResult.rows[0]?.description),
          publish_time: String(videoDetailResult.rows[0]?.publish_time),
          comment_count: parseInt(
            String(videoDetailResult.rows[0]?.comment_count)
          ),
          like_count: parseInt(String(videoDetailResult.rows[0]?.like_count)),
          view_count: parseInt(String(videoDetailResult.rows[0]?.view_count)),
          video_id: String(videoDetailResult.rows[0]?.video_id),
        };

        return {
          video_id: videoResult.video_id,
          channel_id: videoResult.channel_id,
          channel_title: videoResult.channel_title,
          title: videoResult.title,
          description: videoResult.description,
          publish_time: videoResult.publish_time,
          comment_count: videoResult.comment_count,
          like_count: videoResult.like_count,
          view_count: videoResult.like_count,
        };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
          message: "failed to fetch video details",
        });
      }
    }),
  ytVideoComments: publicProcedure
    .input(savedYtVideoInput)
    .output(savedYtCommentOutput)
    .query(async ({ input, ctx }): Promise<SavedYtCommentOutput> => {
      const comments: YouTubeComments[] = await ctx.db.youTubeComments.findMany(
        {
          where: {
            yt_video_id: input.videoId,
          },
        }
      );
      return comments;
    }),
});
