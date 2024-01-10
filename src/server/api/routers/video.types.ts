import z from "zod";
export const savedYtVideoInput = z.object({
  videoId: z.string(),
});

export type SavedYtVideoInput = z.TypeOf<typeof savedYtVideoInput>;

export const savedYtVideoOutput = z.object({
  id: z.string(),
  yt_channel: z.object({
    title: z.string(),
    thumbnail: z.string(),
  }),
  yt_video_id: z.string(),
  yt_video_title: z.string(),
  yt_video_description: z.string(),
  yt_video_thumbnail: z.string(),
  yt_video_comments: z.array(
    z.object({
      text: z.string(),
      mood: z.string(),
    })
  ),
});

export type SavedYtVideoOutput = z.TypeOf<typeof savedYtVideoOutput>;
