import z from "zod";

export const youtubeChannelDetailsInput = z.object({
  ytChannelId: z.string(),
});

export type YoutubeChannelDetailsInput = z.TypeOf<
  typeof youtubeChannelDetailsInput
>;

export const youtubePlaylistItemsInput = z.object({
  userId: z.string(),
  ytChannelId: z.string(),
});

export type YoutubePlaylistItemsInput = z.TypeOf<
  typeof youtubePlaylistItemsInput
>;
