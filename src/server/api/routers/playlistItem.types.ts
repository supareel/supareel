import { z } from "zod";

export const youtubePlaylistItemsOutput = z.array(
  z.object({
    id: z.string(),
    yt_video_id: z.string(),
    yt_channel_id: z.string(),
    user_id: z.string().nullable(),
  })
);

export type YoutubePlaylistItemsOutput = z.TypeOf<
  typeof youtubePlaylistItemsOutput
>;
