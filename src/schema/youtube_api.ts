import z from "zod";

export const youtubeChannelDetailsInput = z.object({
  ytChannelId: z.string(),
});

export type YoutubeChannelDetailsInput = z.TypeOf<
  typeof youtubeChannelDetailsInput
>;
