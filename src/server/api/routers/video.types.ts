import z from "zod";

export const savedYtVideoInput = z.object({
  videoId: z.string(),
});

export type SavedYtVideoInput = z.TypeOf<typeof savedYtVideoInput>;

export const savedYtVideoOutput = z.object({
  channel_id: z.string(),
  channel_title: z.string(),
  title: z.string(),
  description: z.string(),
  publish_time: z.string(),
  comment_count: z.number(),
  like_count: z.number(),
  view_count: z.number(),
  video_id: z.string(),
});
export const savedYtCommentOutput = z.array(
  z.object({
    comment: z.string(),
    sentiment: z.string(),
  })
);
export type SavedYtCommentOutput = z.TypeOf<typeof savedYtCommentOutput>;
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
