import { createTRPCRouter, ytProtectedProcedure } from "~/server/api/trpc";
import {
  type YoutubeChannelDetailsOuput,
  youtubeChannelDetailsInput,
  youtubeChannelDetailsOutput,
} from "~/schema/youtube";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import { getYTChannelDetailsApi } from "../youtube/ytChannelDetails";
// import { getYTChannelUploadApi } from "../youtube/ytChannelUploads";

export const youtubeRouter = createTRPCRouter({
  ytChannelDetails: ytProtectedProcedure
    .input(youtubeChannelDetailsInput)
    .output(youtubeChannelDetailsOutput)
    .query(async ({ ctx, input }): Promise<YoutubeChannelDetailsOuput> => {
      const { ytChannelId } = input;
      const __url = getYTChannelDetailsApi(
        ytChannelId,
        ctx.ytChannel?.access_token ?? "",
        ["snippet", "statistics", "contentDetails"]
      );

      if (!ctx.ytChannel)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "user youtube channel not linked",
        });

      // header
      const response = await axios.get<YoutubeChannelDetailsOuput>(__url, {
        headers: {
          Authorization: `Bearer ${ctx.ytChannel?.access_token}`,
        },
      });
      // make api call
      return response.data;
    }),

  // ytChannelUploads: ytProtectedProcedure
  //   .input(youtubeChannelDetailsInput)
  //   .output(youtubeChannelDetailsOutput)
  //   .query(async ({ ctx, input }): Promise<YoutubeChannelDetailsOuput> => {
  //     const { ytChannelId } = input;
  //     const __url = getYTChannelUploadApi(
  //       ytChannelId,
  //       ctx.ytChannel?.access_token ?? "",
  //       ["snippet", "statistics", "contentDetails"]
  //     );

  //     if (!ctx.ytChannel)
  //       throw new TRPCError({
  //         code: "UNAUTHORIZED",
  //         message: "user youtube channel not linked",
  //       });

  //     // header
  //     const response = await axios.get<YoutubeChannelDetailsOuput>(__url);
  //     // make api call
  //     return response.data;
  //   }),
});
