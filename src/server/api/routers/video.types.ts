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

// ------------------------------- syncVideoComments --------------------------------------------

export const syncVideoCommentsInput = z.object({
  videoId: z.string(),
  accessToken: z.string(),
});

export type SyncVideoCommentsInput = z.TypeOf<typeof syncVideoCommentsInput>;

export const syncVideoCommentsOutput = z.array(
  z.object({
    emojis: z.string(),
    comment: z.string(),
    commentId: z.string(),
    mood: z.string(),
    authorDisplayName: z.string(),
    authorProfilePic: z.string(),
    authorChannelUrl: z.string(),
    authorChannelId: z.string(),
  })
);

export type SyncVideoCommentsOutput = z.TypeOf<typeof syncVideoCommentsOutput>;
