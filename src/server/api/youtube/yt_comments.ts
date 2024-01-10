import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";
import { z } from "zod";

export const getYTVideoCommentsApi = (
  ytvideoId: string,
  access_token: string,
  part: string[]
): string => {
  const endpoint = "commentThreads";
  const queryString = qs.stringify({
    part: part.toString(),
    videoId: ytvideoId,
    key: env.YT_API_KEY,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const ytVideoCommentsApiResponse = z.object({
  kind: z.string(),
  etag: z.string(),
  nextPageToken: z.string(),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.string(),
      snippet: z.object({
        channelId: z.string(),
        videoId: z.string(),
        topLevelComment: z.object({
          kind: z.string(),
          etag: z.string(),
          id: z.string(),
          snippet: z.object({
            channelId: z.string(),
            videoId: z.string(),
            textDisplay: z.string(),
            textOriginal: z.string(),
            authorDisplayName: z.string(),
            authorProfileImageUrl: z.string(),
            authorChannelUrl: z.string(),
            authorChannelId: z.object({ value: z.string() }),
            canRate: z.boolean(),
            viewerRating: z.string(),
            likeCount: z.number(),
            publishedAt: z.string(),
            updatedAt: z.string(),
          }),
        }),
        canReply: z.boolean(),
        totalReplyCount: z.number(),
        isPublic: z.boolean(),
      }),
      replies: z.object({
        comments: z.array(
          z.object({
            kind: z.string(),
            etag: z.string(),
            id: z.string(),
            snippet: z.object({
              channelId: z.string(),
              videoId: z.string(),
              textDisplay: z.string(),
              textOriginal: z.string(),
              parentId: z.string(),
              authorDisplayName: z.string(),
              authorProfileImageUrl: z.string(),
              authorChannelUrl: z.string(),
              authorChannelId: z.object({ value: z.string() }),
              canRate: z.boolean(),
              viewerRating: z.string(),
              likeCount: z.number(),
              publishedAt: z.string(),
              updatedAt: z.string(),
            }),
          })
        ),
      }),
    })
  ),
});

export type YTVideoCommentsApiResponse = z.TypeOf<
  typeof ytVideoCommentsApiResponse
>;
