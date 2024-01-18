/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  DATASOURCE_NAME,
  SENTIMENT_CLASSIFIER,
} from "~/server/mindsdb/constants";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { showHandlersOutput, showModelsQueryResponse } from "./mindsdb.types";
import type {
  ShowHandlersOutput,
  ShowModelsQueryResponse,
  AnalyseCommentsOutput,
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

export const mindsdbRouter = createTRPCRouter({
  showHandlers: publicProcedure
    .output(showHandlersOutput)
    .query(async (): Promise<ShowHandlersOutput> => {
      const query = "SHOW HANDLERS WHERE type = 'data'";
      const result: SqlQueryResult = await MindsDB.SQL.runQuery(query);
      const response: ShowHandlersOutput = result.rows.map((handle) => ({
        name: handle.name,
        type: handle.type,
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
          DATASOURCE_NAME
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
        (_d) => _d.name == SENTIMENT_CLASSIFIER
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
});

export async function analyseComments(
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
