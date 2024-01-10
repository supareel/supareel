import { z } from "zod";
import { ytChannelDetailsDb } from "~/schema/db";

export const savedYtChannelDetailsOutput = z.object({
  channels: z.array(ytChannelDetailsDb),
});

export type SavedYtChannelDetailsOutput = z.TypeOf<
  typeof savedYtChannelDetailsOutput
>;

export const savedYtChannelDetailsInput = z.object({
  userId: z.string(),
});

export type SavedYtChannelDetailsInput = z.TypeOf<
  typeof savedYtChannelDetailsInput
>;
