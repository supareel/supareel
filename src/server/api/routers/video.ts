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
import { removeHtmlTags } from "~/utils/remove_html";
import {
  savedYtVideoInput,
  savedYtVideoOutput,
  syncVideoCommentsInput,
  syncVideoCommentsOutput,
  type SyncVideoCommentsOutput,
  type SavedYtVideoOutput,
} from "~/server/api/routers/video.types";
import { analyseComments } from "./mindsdb";

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
  syncVideoComments: publicProcedure
    .input(syncVideoCommentsInput)
    .output(syncVideoCommentsOutput)
    .query(async ({ ctx, input }): Promise<SyncVideoCommentsOutput> => {
      const { videoId, accessToken } = input;

      try {
        const __comments_url = getYTVideoCommentsApi(videoId, accessToken, [
          "snippet",
          "replies",
        ]);

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
        const comments: {
          commentId: string;
          authorDisplayName: string;
          authorChannelUrl: string;
          authorChannelId: string;
          emojis: string;
          comment: string;
          mood: string;
          authorProfilePic: string;
          videoId: string;
        }[] = comment_response.data.items.flatMap((dat) => {
          let _comments_: {
            commentId: string;
            authorDisplayName: string;
            authorChannelUrl: string;
            authorChannelId: string;
            emojis: string;
            comment: string;
            mood: string;
            authorProfilePic: string;
            videoId: string;
          }[] = [];
          const _textFiltered = separateEmojiFromText(
            dat.snippet.topLevelComment.snippet.textDisplay
          );

          _comments_ = [
            {
              comment: removeHtmlTags(
                dat.snippet.topLevelComment.snippet.textDisplay
              ),
              emojis: _textFiltered.emojis,
              commentId: dat.snippet.topLevelComment.id,
              authorDisplayName:
                dat.snippet.topLevelComment.snippet.authorDisplayName,
              authorChannelId:
                dat.snippet.topLevelComment.snippet.authorChannelId.value,
              authorChannelUrl:
                dat.snippet.topLevelComment.snippet.authorChannelUrl,
              authorProfilePic:
                dat.snippet.topLevelComment.snippet.authorProfileImageUrl,
              mood: "",
              videoId: dat.snippet.videoId,
            },
          ];

          if (dat.replies)
            _comments_.push(
              ...dat.replies.comments.map((reply) => {
                const _replyFiltered = separateEmojiFromText(
                  reply.snippet.textDisplay
                );
                const _replyFilteredText = removeHtmlTags(
                  reply.snippet.textDisplay
                );

                return {
                  commentId: reply.id,
                  comment: _replyFilteredText,
                  emojis: _replyFiltered.emojis,
                  mood: "",
                  videoId: reply.snippet.videoId,
                  authorProfilePic: reply.snippet.authorProfileImageUrl,
                  authorDisplayName: reply.snippet.authorDisplayName,
                  authorChannelId: reply.snippet.authorChannelId.value,
                  authorChannelUrl: reply.snippet.authorChannelUrl,
                  authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
                };
              })
            );

          return _comments_;
        });

        // save all comments
        const ___data = await Promise.all(
          comments.map(async (cmt) => {
            return await ctx.db.youTubeComments.upsert({
              where: {
                yt_comment_id: cmt.commentId,
              },
              create: {
                yt_video_id: cmt.videoId,
                yt_comment_id: cmt.commentId,
                emojis: cmt.emojis,
                comment: cmt.comment,
                mood: cmt.mood,
                author_display_name: cmt.authorDisplayName,
                author_profile_pic: cmt.authorProfilePic,
                author_channel_url: cmt.authorChannelUrl,
                author_channel_id: cmt.authorChannelId,
              },
              update: {
                emojis: cmt.emojis,
                comment: cmt.comment,
                mood: cmt.mood,
                author_display_name: cmt.authorDisplayName,
                author_profile_pic: cmt.authorProfilePic,
                author_channel_url: cmt.authorChannelUrl,
                author_channel_id: cmt.authorChannelId,
              },
            });
          })
        );

        const response: SyncVideoCommentsOutput = ___data.map((data) => {
          return {
            comment: data.comment,
            mood: data.mood,
            emojis: data.emojis,
            commentId: data.yt_comment_id,
            authorChannelId: data.author_channel_id,
            authorChannelUrl: data.author_channel_url,
            authorDisplayName: data.author_display_name,
            authorProfilePic: data.author_profile_pic,
          };
        });

        await analyseComments();

        return response;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unable to get youtube videos for this channel",
          cause: err,
        });
      }
    }),
});
