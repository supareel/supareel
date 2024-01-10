import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";
import { z } from "zod";

export const getYTPlaylistVideosApi = (
  ytPlaylistId: string,
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlistItems";
  const queryString = qs.stringify({
    part: part.toString(),
    playlistId: ytPlaylistId,
    key: env.YT_API_KEY,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const getMyYTChannelVideosApi = (
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlistItems";
  const queryString = qs.stringify({
    part: part.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const ytPlaylistVideosApiResponse = z.object({
  kind: z.string(),
  etag: z.string(),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.string(),
      snippet: z.object({
        publishedAt: z.string(),
        channelId: z.string(),
        title: z.string(),
        description: z.string(),
        thumbnails: z.object({
          default: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          medium: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          high: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          standard: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          maxres: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
        }),
        channelTitle: z.string(),
        playlistId: z.string(),
        position: z.number(),
        resourceId: z.object({ kind: z.string(), videoId: z.string() }),
        videoOwnerChannelTitle: z.string(),
        videoOwnerChannelId: z.string(),
      }),
      contentDetails: z.object({
        videoId: z.string(),
        videoPublishedAt: z.string().datetime(),
      }),
    })
  ),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
});

export type YTPlaylistVideosApiResponse = z.TypeOf<
  typeof ytPlaylistVideosApiResponse
>;
