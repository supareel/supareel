import z from "zod";

export const youtubeChannelDetailsInput = z.object({
  ytChannelId: z.string(),
});

export type YoutubeChannelDetailsInput = z.TypeOf<
  typeof youtubeChannelDetailsInput
>;

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

export const youtubePlaylistItemsInput = z.object({
  userId: z.string(),
});

export type YoutubePlaylistItemsInput = z.TypeOf<
  typeof youtubePlaylistItemsInput
>;

export const youtubePlaylistItemsOutput = z.object({
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
        videoPublishedAt: z.string(),
      }),
    })
  ),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
});

export type YoutubePlaylistItemsOuput = z.TypeOf<
  typeof youtubePlaylistItemsOutput
>;
