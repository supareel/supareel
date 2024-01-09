import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";
import { z } from "zod";

export const getYTMyChannelUploadsListApi = (
  ytChannelIds: string[],
  access_token: string,
  part: string[]
): string => {
  const endpoint = "playlists";
  const queryString = qs.stringify({
    part: part.toString(),
    id: ytChannelIds.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const ytMyChannelUploadsListApiResponse = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
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
        localized: z.object({ title: z.string(), description: z.string() }),
      }),
      contentDetails: z.object({ itemCount: z.number() }),
    })
  ),
});

export type YTMyChannelUploadsListApiResponse = z.TypeOf<
  typeof ytMyChannelUploadsListApiResponse
>;
