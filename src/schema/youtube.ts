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
        tags: z.array(z.string()),
        categoryId: z.string(),
        liveBroadcastContent: z.string(),
        defaultLanguage: z.string(),
        localized: z.object({ title: z.string(), description: z.string() }),
        defaultAudioLanguage: z.string(),
      }),
      contentDetails: z.object({
        duration: z.string(),
        dimension: z.string(),
        definition: z.string(),
        caption: z.string(),
        licensedContent: z.boolean(),
        contentRating: z.object({}),
        projection: z.string(),
      }),
      statistics: z.object({
        viewCount: z.string(),
        likeCount: z.string(),
        favoriteCount: z.string(),
        commentCount: z.string(),
      }),
    })
  ),
  pageInfo: z.object({ totalResults: z.number(), resultsPerPage: z.number() }),
});

export type YoutubeChannelDetailsOuput = z.TypeOf<
  typeof youtubeChannelDetailsOutput
>;
