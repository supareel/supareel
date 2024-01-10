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
import { generateCommentHash } from "~/utils/generate_hash";
import { removeHtmlTags } from "~/utils/remove_html";
import {
  type SavedYtVideoOutput,
  savedYtVideoInput,
  savedYtVideoOutput,
} from "~/server/api/routers/video.types";

export const videoRouter = createTRPCRouter({
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
        const __data__ = response.data.items.map((dat) => ({
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
            let comments: {
              raw: string;
              text: string;
              videoId: string;
              emojis: string;
            }[] = [];
            const _textFiltered = separateEmojiFromText(
              dat.snippet.topLevelComment.snippet.textDisplay
            );

            comments = [
              {
                raw: removeHtmlTags(
                  dat.snippet.topLevelComment.snippet.textDisplay
                ),
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
                    raw: removeHtmlTags(reply.snippet.textDisplay),
                    text: _replyFiltered.text,
                    emojis: _replyFiltered.emojis,
                    videoId: reply.snippet.videoId,
                  };
                })
              );

            // save all comments
            comments.map(async (cmt) => {
              const _hash_ = generateCommentHash(cmt.text);
              await ctx.db.youTubeComments.upsert({
                where: {
                  hash: _hash_,
                },
                create: {
                  yt_video_id: cmt.videoId,
                  emojis: cmt.emojis,
                  comment: cmt.raw,
                  hash: _hash_,
                  mood: "",
                },
                update: {
                  yt_video_id: cmt.videoId,
                  emojis: cmt.emojis,
                  comment: cmt.raw,
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
  ytVideoDetails: publicProcedure
    .input(savedYtVideoInput)
    .output(savedYtVideoOutput)
    .query(async ({ ctx, input }): Promise<SavedYtVideoOutput> => {
      const dbVideoResponse = await ctx.db.youTubeVideo.findFirstOrThrow({
        where: {
          yt_video_id: input.videoId,
        },
      });

      const dbChannelResponse =
        await ctx.db.youTubeChannelDetails.findFirstOrThrow({
          where: {
            yt_channel_id: dbVideoResponse.yt_channel_id,
          },
        });

      const dbCommentsResponse = await ctx.db.youTubeComments.findMany({
        where: {
          yt_video_id: input.videoId,
        },
      });

      return {
        id: dbVideoResponse.id,
        yt_channel: {
          title: dbChannelResponse.yt_channel_title ?? "",
          thumbnail: dbChannelResponse.yt_channel_thumbnails ?? "",
        },
        yt_video_description: dbVideoResponse.yt_video_description,
        yt_video_id: dbVideoResponse.yt_video_id,
        yt_video_thumbnail: dbVideoResponse.yt_video_thumbnail,
        yt_video_title: dbVideoResponse.yt_video_title,
        yt_video_comments: dbCommentsResponse.map((cmt) => ({
          text: cmt.comment,
          mood: cmt.mood,
        })),
      };
    }),
});
