import z from "zod";
import { ytChannelDetailsDb } from "./db";

export const savedYtChannelDetailsInput = z.object({
  userId: z.string(),
});

export type SavedYtChannelDetailsInput = z.TypeOf<
  typeof savedYtChannelDetailsInput
>;

export const savedYtChannelDetailsOutput = z.object({
  channels: z.array(ytChannelDetailsDb),
});

export type SavedYtChannelDetailsOutput = z.TypeOf<
  typeof savedYtChannelDetailsOutput
>;
