import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { YouTubeComments, YouTubeVideo } from "@prisma/client";
import MindsDB, { type SqlQueryResult } from "mindsdb-js-sdk";
import { TRPCError } from "@trpc/server";
import {
  type YoutubeVideoOutput,
  youtubeVideoOutput,
  savedYtVideoInput,
  savedYtVideoOutput,
  type SavedYtVideoOutput,
  getUserUploadedVideosInput,
  type SavedYtCommentOutput,
  savedYtCommentOutput,
} from "~/server/api/routers/video.types";

export const videoRouter = createTRPCRouter({
  getUserUploadedVideos: publicProcedure
    .input(getUserUploadedVideosInput)
    .output(youtubeVideoOutput)
    .query(async ({ ctx, input }): Promise<YoutubeVideoOutput> => {
      const { channel_id } = input;
      const dbSavedYtVideosResponse: YouTubeVideo[] =
        await ctx.db.youTubeVideo.findMany({
          where: {
            yt_channel_id: channel_id,
          },
        });
      return dbSavedYtVideosResponse as YoutubeVideoOutput;
    }),
  ytVideoDetailsByVideoId: publicProcedure
    .input(savedYtVideoInput)
    .output(savedYtVideoOutput)
    .query(async ({ ctx, input }): Promise<SavedYtVideoOutput> => {
      const videoDetailQuery = `SELECT channel_id, channel_title, title, description, publish_time,
      comment_count,like_count, view_count, video_id 
      FROM supareel_db.videos WHERE video_id = '${input.video_id}';`;
      try {
        const videoDetailResult: SqlQueryResult = await MindsDB.SQL.runQuery(
          videoDetailQuery
        );

        const createdYtVideo: YouTubeVideo = await ctx.db.youTubeVideo.create({
          data: {
            yt_video_title: String(videoDetailResult.rows[0]?.title),
            yt_video_description: String(
              videoDetailResult.rows[0]?.description
            ),
            yt_video_thumbnail: "",
            yt_channel_id: String(videoDetailResult.rows[0]?.channel_id),
            yt_video_id: String(videoDetailResult.rows[0]?.video_id),
            comment_count: parseInt(
              String(videoDetailResult.rows[0]?.comment_count)
            ),
            like_count: parseInt(String(videoDetailResult.rows[0]?.like_count)),
            view_count: parseInt(String(videoDetailResult.rows[0]?.view_count)),
          },
        });

        const videoResult = {
          channel_title: String(videoDetailResult.rows[0]?.channel_title),
          channel_id: createdYtVideo.yt_channel_id ?? "",
          title: createdYtVideo.yt_video_title,
          description: createdYtVideo.yt_video_description,
          publish_time: String(videoDetailResult.rows[0]?.publish_time),
          comment_count: createdYtVideo.comment_count,
          like_count: createdYtVideo?.like_count,
          view_count: createdYtVideo?.view_count,
          video_id: createdYtVideo.yt_video_title,
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
            yt_video_id: input.video_id,
          },
        }
      );
      return comments as SavedYtCommentOutput;
    }),
});
