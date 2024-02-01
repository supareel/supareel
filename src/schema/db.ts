import { z } from "zod";

export const userDb = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.date().optional(),
  image: z.string().url().optional(),
});

export type UserDb = z.TypeOf<typeof userDb>;

export const ytChannelDetailsDb = z.object({
  id: z.number(),
  yt_channel_id: z.string(),
  yt_channel_title: z.string().nullable(),
  yt_channel_thumbnails: z.string().nullable(),
  yt_channel_customurl: z.string().nullable(),
  yt_channel_published_at: z.date().optional(),
  user_id: z.string(),
  subscriber_count: z.bigint().nullable(),
  video_count: z.bigint().nullable(),
  view_count: z.bigint().nullable(),
});

export type YtChannelDetailsDb = z.TypeOf<typeof ytChannelDetailsDb>;
