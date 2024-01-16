import { string, z } from "zod";

export const showHandlersOutput = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    importable: z.boolean().default(false),
  })
);

export type ShowHandlersOutput = z.TypeOf<typeof showHandlersOutput>;

export const showModelsQueryResponse = z.object({
  name: z.string(),
  project: z.string(),
  version: z.number(),
  status: z.string(),
});

export type ShowModelsQueryResponse = z.TypeOf<typeof showModelsQueryResponse>;

export const saveYoutubeVideoCommentsInput = z.object({
  videoId: z.string(),
});

export type SaveYoutubeVideoCommentsInput = z.TypeOf<
  typeof saveYoutubeVideoCommentsInput
>;

export const saveYoutubeVideoCommentsOutput = z.object({
  id: z.string(),
  yt_comment_id: z.string(),
  author_display_name: z.string(),
  author_profile_pic: z.string(),
  author_channel_url: z.string(),
  author_channel_id: z.string(),
  yt_video_id: z.string(),
  comment: z.string(),
  mood: z.string(),
  emojis: z.string(),
});

export type SaveYoutubeVideoCommentsOutput = z.TypeOf<
  typeof saveYoutubeVideoCommentsOutput
>;

export const analyseCommentsOutput = z.object({
  comment: z.string(),
  video_id: z.string(),
  comment_id: z.string(),
  sentiment: z.string(),
});

export type AnalyseCommentsOutput = z.TypeOf<typeof analyseCommentsOutput>;
