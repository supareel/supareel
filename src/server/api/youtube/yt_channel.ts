import qs from "querystring";
import { env } from "~/env";
import { createYoutubeUrl } from "./utils";
import { z } from "zod";
export const getYTChannelDetailsApi = (
  ytChannelId: string,
  access_token: string,
  part: string[]
): string => {
  const endpoint = "channels";
  const queryString = qs.stringify({
    part: part.toString(),
    id: ytChannelId,
    key: env.YT_API_KEY,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const getMyYTChannelDetailsApi = (
  access_token: string,
  part: string[]
): string => {
  const endpoint = "channels";
  const queryString = qs.stringify({
    part: part.toString(),
    key: env.YT_API_KEY,
    mine: true,
    access_token: access_token,
  });

  return createYoutubeUrl(endpoint, queryString);
};

export const youtubeChannelDetailsOutput = z.object({
  kind: z.string(),
  etag: z.string(),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
  items: z.array(
    z.object({
      kind: z.string(),
      etag: z.string(),
      id: z.string(),
      snippet: z.object({
        title: z.string(),
        description: z.string(),
        customUrl: z.string(),
        publishedAt: z.string(),
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
        }),
        localized: z.object({ title: z.string(), description: z.string() }),
        country: z.string(),
      }),
      contentDetails: z.object({
        relatedPlaylists: z.object({ likes: z.string(), uploads: z.string() }),
      }),
      statistics: z.object({
        viewCount: z.string(),
        subscriberCount: z.string(),
        hiddenSubscriberCount: z.boolean(),
        videoCount: z.string(),
      }),
    })
  ),
});

export type YoutubeChannelDetailsOuput = z.TypeOf<
  typeof youtubeChannelDetailsOutput
>;
