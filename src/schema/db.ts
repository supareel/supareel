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
  id: z.string(),
  yt_channel_id: z.string(),
  yt_channel_title: z.string(),
  yt_channel_thumbnails: z.string(),
  yt_channel_customurl: z.string(),
  yt_channel_uploads_playlist_id: z.string(),
  yt_channel_published_at: z.date(),
  userId: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  id_token: z.string(),
  expiry_date: z.bigint(),
});

export type YtChannelDetailsDb = z.TypeOf<typeof ytChannelDetailsDb>;
