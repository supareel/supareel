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
  id: z.string().optional(),
  yt_channel_id: z.string().optional(),
  yt_channel_title: z.string().optional(),
  yt_channel_thumbnails: z.string().optional(),
  yt_channel_customurl: z.string().optional(),
  yt_channel_published_at: z.date().optional(),
  userId: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  id_token: z.string().optional(),
  expiry_date: z.bigint().optional(),
});

export type YtChannelDetailsDb = z.TypeOf<typeof ytChannelDetailsDb>;
