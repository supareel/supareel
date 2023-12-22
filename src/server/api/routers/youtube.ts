import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type YoutubeChannelDetailsOuput,
  youtubeChannelDetailsInput,
  youtubeChannelDetailsOutput,
} from "~/schema/youtube";
import { getYTChannelDetailsApi } from "../youtube_api";

export const youtubeRouter = createTRPCRouter({
  ytChannelDetails: publicProcedure
    .input(youtubeChannelDetailsInput)
    .output(youtubeChannelDetailsOutput)
    .query(async ({ input }): Promise<YoutubeChannelDetailsOuput> => {
      const { ytChannelId } = input;
      const __url = getYTChannelDetailsApi(ytChannelId);
      console.log(`\n\n${__url.toString()}\n\n`);

      // make api call

      const response: YoutubeChannelDetailsOuput = {
        kind: id,
      };

      return response;
    }),
});
