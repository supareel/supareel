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
import { separateEmojiFromText } from "~/utils/extract_emoji";

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
        response.data.items[0]?.contentDetails.videoId;
        // save the youtube videos
        const __data__: YouTubeVideo[] = response.data.items.map((dat) => ({
          user_id: userId,
          yt_channel_id: dat.snippet.channelId ?? "",
          yt_video_id: dat.contentDetails.videoId,
          yt_video_title: dat.snippet.title,
          yt_video_description: dat.snippet.description,
          yt_video_thumbnail: dat.snippet.thumbnails.medium.url,
        }));

        __data__.map(async (ytVid) => {
          await ctx.db.youTubeVideo.upsert({
            where: {
              yt_video_id: ytVid.yt_video_id,
            },
            update: {
              yt_video_title: ytVid.yt_video_title.toString() ?? "",
              yt_video_description: ytVid.yt_video_description.toString() ?? "",
              yt_video_thumbnail: ytVid.yt_video_thumbnail.toString() ?? "",
            },
            create: ytVid,
          });
        });

        const dbSavedYtVideosResponse: YouTubeVideo[] =
          await ctx.db.youTubeVideo.findMany({
            where: {
              yt_channel_id: ytChannelId,
            },
          });

        const userChannelVideosId = dbSavedYtVideosResponse.map((e) =>
          String(e.yt_video_id)
        );

        userChannelVideosId.map(async (ytVidId) => {
          const __comments_url = getYTVideoCommentsApi(
            ytVidId,
            dbResponse.access_token,
            ["snippet", "replies"]
          );
          // get comments for all videos
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
            let comments: { text: string; videoId: string; emojis: string }[] =
              [];
            const _textFiltered = separateEmojiFromText(
              dat.snippet.topLevelComment.snippet.textDisplay
            );

            comments = [
              {
                text: _textFiltered.text,
                videoId: dat.snippet.videoId,
                emojis: _textFiltered.emojis,
              },
            ];

            if (dat.replies)
              comments.push(
                ...dat.replies.comments.map((reply) => {
                  const _replyFiltered = separateEmojiFromText(
                    reply.snippet.textDisplay
                  );
                  return {
                    text: _replyFiltered.text,
                    emojis: _replyFiltered.emojis,
                    videoId: reply.snippet.videoId,
                  };
                })
              );

            // save all comments
            comments.map(async (cmt) => {
              await ctx.db.youTubeComments.upsert({
                where: {
                  comment: cmt.text,
                },
                create: {
                  yt_video_id: cmt.videoId,
                  emojis: cmt.emojis,
                  comment: cmt.text,
                },
                update: {
                  yt_video_id: cmt.videoId,
                  emojis: cmt.emojis,
                  comment: cmt.text,
                },
              });
            });
          });
        });
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
