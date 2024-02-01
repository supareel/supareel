import { createTRPCRouter, ytProtectedProcedure } from "~/server/api/trpc";
import { youtubeChannelDetailsInput } from "~/schema/youtube_api";
import { TRPCError } from "@trpc/server";
import {
  type YoutubeChannelDetailsOuput,
  youtubeChannelDetailsOutput,
} from "../youtube/yt_channel";
import MindsDB, {
  type Database,
  type Model,
  type SqlQueryResult,
  type TrainingOptions,
} from "mindsdb-js-sdk";
import { ShowHandlersOutput } from "./mindsdb.types";

export const youtubeRouter = createTRPCRouter({
  ytChannelDetails: ytProtectedProcedure
    .input(youtubeChannelDetailsInput)
    .output(youtubeChannelDetailsOutput)
    .query(async ({ ctx, input }): Promise<YoutubeChannelDetailsOuput> => {
      const { ytChannelId } = input;

      if (!ytChannelId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "user youtube channel not linked",
        });

      const query = "SHOW HANDLERS WHERE type = 'data'";
      const result: SqlQueryResult = await MindsDB.SQL.runQuery(query);
      console.log(JSON.stringify(result, null, 2));
      // const response: ShowHandlersOutput = result.rows.map((handle) => ({
      //   name: handle.name,
      //   type: handle.type,
      //   importable: handle.import_success,
      // }));

      return {
        etag: "",
        items: [],
        kind: "",
        pageInfo: {
          resultsPerPage: 0,
          totalResults: 0,
        },
      };
    }),
});
