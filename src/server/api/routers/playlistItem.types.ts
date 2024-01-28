import { z } from "zod";

export const youtubePlaylistItemsOutput = z.array(
  z.object({
    id: z.string(),
    yt_video_id: z.string(),
    yt_channel_id: z.string(),
    yt_video_title: z.string(),
    yt_video_description: z.string(),
    yt_video_thumbnail: z.string(),
  })
);

export type YoutubePlaylistItemsOutput = z.TypeOf<
  typeof youtubePlaylistItemsOutput
>;
