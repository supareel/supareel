import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  manualSyncMyUploadedVideosInput,
  manualSyncMyUploadedVideosOutput,
  manualSyncVideosCommentsInput,
  manualSyncVideosCommentsOutput,
  showHandlersOutput,
  showModelsQueryResponse,
} from "./mindsdb.types";
import type {
  ShowHandlersOutput,
  ShowModelsQueryResponse,
  AnalyseCommentsOutput,
  ManualSyncMyUploadedVideosOutput,
  ManualSyncVideosCommentsOutput,
} from "./mindsdb.types";
import MindsDB, {
  type Database,
  type Model,
  type SqlQueryResult,
  type TrainingOptions,
} from "mindsdb-js-sdk";
import { z } from "zod";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import type { YouTubeComments, YouTubeVideo } from "@prisma/client";

export const mindsdbRouter = createTRPCRouter({
  showHandlers: publicProcedure
    .output(showHandlersOutput)
    .query(async (): Promise<ShowHandlersOutput> => {
      const query = "SHOW HANDLERS WHERE type = 'data'";
      const result: SqlQueryResult = await MindsDB.SQL.runQuery(query);
      const response: ShowHandlersOutput = result.rows.map((handle) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: handle.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: handle.type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        importable: handle.import_success,
      }));

      return response;
    }),
  connectPlanetScaleDB: publicProcedure
    .output(z.boolean())
    .query(async (): Promise<boolean> => {
      const connectionParams = {
        user: env.DATABASE_USER,
        port: env.DATABASE_PORT,
        password: env.DATABASE_PASSWORD,
        host: env.DATABASE_HOST,
        database: env.DATABASE_NAME,
      };

      try {
        const db: Database | undefined = await MindsDB.Databases.getDatabase(
          env.DATASOURCE_NAME
        );

        if (!db) {
          await MindsDB.Databases.createDatabase(
            "planetscale_datasource",
            "planet_scale",
            connectionParams
          );
        }

        console.log(
          "\n----------------------------------- connected a planetscale database ----------------------------------\n"
        );
        return true;
      } catch (error) {
        // Couldn't connect to database
        console.log(error);
      }
      return false;
    }),
  loadSentimentAnalysisModel: publicProcedure
    .output(showModelsQueryResponse)
    .query(async (): Promise<ShowModelsQueryResponse> => {
      const _models: Model[] = await MindsDB.Models.getAllModels("mindsdb");

      const idx: number = _models.findIndex(
        (_d) => _d.name == env.SENTIMENT_CLASSIFIER
      );

      if (idx == -1) {
        const trainingOptions: TrainingOptions = {
          using: {
            engine: "huggingface",
            model_name: "cardiffnlp/twitter-roberta-base-sentiment",
            input_column: "comment",
            labels: ["negative", "neutral", "positive"],
          },
        };
        const model: Model = await MindsDB.Models.trainModel(
          "sentiment_classifier",
          "comment",
          "mindsdb",
          trainingOptions
        );

        return {
          name: model.name,
          project: model.project,
          status: model.status,
          version: model.version,
        };
      }

      return {
        name: _models[idx]?.name ?? "",
        project: _models[idx]?.project ?? "",
        status: _models[idx]?.status ?? "",
        version: _models[idx]?.version ?? 0,
      };
    }),

  createRequredJobsForChannel: publicProcedure
    .output(showModelsQueryResponse)
    .query(async (): Promise<ShowModelsQueryResponse> => {
      const _models: Model[] = await MindsDB.Models.getAllModels("mindsdb");

      const idx: number = _models.findIndex(
        (_d) => _d.name == env.SENTIMENT_CLASSIFIER
      );

      if (idx == -1) {
        const query = "SHOW HANDLERS WHERE type = 'data'";
        const result: SqlQueryResult = await MindsDB.SQL.runQuery(query);
        const response: ShowHandlersOutput = result.rows.map((handle) => ({
          name: handle.name,
          type: handle.type,
          importable: handle.import_success,
        }));
        return {
          name: "",
          project: "",
          status: "",
          version: 0,
        };
      }

      return {
        name: _models[idx]?.name ?? "",
        project: _models[idx]?.project ?? "",
        status: _models[idx]?.status ?? "",
        version: _models[idx]?.version ?? 0,
      };
    }),

  manualSyncMyUploadedVideos: publicProcedure
    .input(manualSyncMyUploadedVideosInput)
    .output(manualSyncMyUploadedVideosOutput)
    .query(
      async ({ ctx, input }): Promise<ManualSyncMyUploadedVideosOutput> => {
        const { channel_id } = input;

        const query_sync_videos = `INSERT INTO planetscale_datasource.YouTubeVideo (
        SELECT 
        video_id as yt_video_id, 
        channel_id as yt_channel_id, 
        title AS yt_video_title, 
        description as yt_video_description, 
        thumbnail as yt_video_thumbnail  
        FROM supareel_db.videos 
        WHERE 
        channel_id = '${channel_id}'
      )`;
        try {
          const result: SqlQueryResult = await MindsDB.SQL.runQuery(
            query_sync_videos
          );
          if (result.type !== "ok")
            new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              cause: "ai engine went down",
              message: "unable to sync youtube videos",
            });

          const dbResponse: YouTubeVideo =
            await ctx.db.youTubeVideo.findFirstOrThrow({
              where: {
                yt_channel_id: channel_id,
              },
            });

          return dbResponse as ManualSyncMyUploadedVideosOutput;
        } catch (err) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "unable to get youtube videos for this channel",
            cause: err,
          });
        }
      }
    ),
  manualSyncVideoComments: publicProcedure
    .input(manualSyncVideosCommentsInput)
    .output(manualSyncVideosCommentsOutput)
    .query(async ({ input, ctx }): Promise<ManualSyncVideosCommentsOutput> => {
      const { video_id } = input;

      const query_sync_videos_comments = `INSERT INTO planetscale_datasource.YouTubeComments(
        SELECT DISTINCT yt_comment,
          tc.comment_id AS yt_comment_id,
          tc.video_id AS yt_video_id,
          tc.comment AS yt_comment
        FROM supareel_db.comments tc
        LEFT JOIN planetscale_datasource.YouTubeComments yc ON tc.comment_id = yc.yt_comment_id
        WHERE yc.yt_comment_id IS NULL AND tc.video_id='${video_id}'
      );`;
      try {
        const result: SqlQueryResult = await MindsDB.SQL.runQuery(
          query_sync_videos_comments
        );
        if (result.type !== "ok")
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "ai engine went down",
            message: "unable to sync youtube videos",
          });
        const comments: YouTubeComments[] =
          await ctx.db.youTubeComments.findMany({
            where: {
              yt_video_id: input.video_id,
            },
          });
        return comments as ManualSyncVideosCommentsOutput;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "unable to get comment for this video",
          cause: err,
        });
      }
    }),
});

export async function ______(
  videoId: string
): Promise<AnalyseCommentsOutput[]> {
  const countCommentsQuery = `SELECT comment_id FROM supareel_db.comments AS input WHERE input.video_id = "${videoId}";`;
  const videoViewQuery = (
    videoId: string,
    limit: number
  ) => `SELECT input.comment, input.video_id, input.comment_id, model.sentiment
  FROM supareel_db.comments AS input
  JOIN supareel.sentiment_classifier AS model
  WHERE input.video_id = "${videoId}" LIMIT ${limit}`;
  try {
    const countCommentsResult: SqlQueryResult = await MindsDB.SQL.runQuery(
      countCommentsQuery
    );
    const countCommentsCount: number = Math.ceil(
      countCommentsResult.rows.length / 10
    );

    let videoCommentView: AnalyseCommentsOutput[] = [];
    for (let i = 1; i <= countCommentsCount; i++) {
      const query = videoViewQuery(videoId, i * 10);
      const saveCommentResult: SqlQueryResult = await MindsDB.SQL.runQuery(
        query
      );
      console.log(saveCommentResult.rows.length);
      videoCommentView = saveCommentResult.rows.map((row) => ({
        comment: row.comment,
        video_id: row.yt_video_id,
        comment_id: row.yt_comment_id,
        sentiment: row.sentiment,
      }));
    }
    return videoCommentView;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "unable to infer mood for comments",
      cause: err,
    });
  }
}
