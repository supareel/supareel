/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";
import {
  DATASOURCE_NAME,
  SENTIMENT_CLASSIFIER,
} from "~/server/mindsdb/constants";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  showHandlersOutput,
  showModelsQueryResponse,
  saveYoutubeVideoCommentsInput,
  saveYoutubeVideoCommentsOutput,
} from "./mindsdb.types";
import type {
  ShowHandlersOutput,
  ShowModelsQueryResponse,
  SaveYoutubeVideoCommentsOutput,
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
import { Prisma } from "@prisma/client";

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

export async function analyseComments(): Promise<
  SaveYoutubeVideoCommentsOutput[]
> {
  const videoViewQuery = `SELECT input.comment, input.yt_video_id, input.yt_comment_id, model.sentiment
  FROM planetscale_datasource.YouTubeComments AS input 
  JOIN supareel.sentiment_classifier AS model;`;
  try {
    const saveCommentResult: SqlQueryResult = await MindsDB.SQL.runQuery(
      videoViewQuery
    );

    console.log(saveCommentResult);

    const videoCommentView: {
      comment: string;
      video_id: string;
      comment_id: string;
      sentiment: string;
    }[] = saveCommentResult.rows.map((row) => ({
      comment: row.comment,
      video_id: row.yt_video_id,
      comment_id: row.yt_comment_id,
      sentiment: row.sentiment,
    }));

    console.log("===========================================================");
    console.log(
      videoCommentView.map((c) => ({
        comment: c.comment,
        mood: c.sentiment,
        comment_id: c.comment_id,
      })),
      "\n"
    );
    console.log("===========================================================");

    const response = await Promise.all(
      videoCommentView.map(async (_data) => {
        return await db.youTubeComments.update({
          data: {
            comment: _data.comment,
            yt_video_id: _data.video_id,
            yt_comment_id: _data.comment_id,
            mood: _data.sentiment,
          },
          where: {
            yt_comment_id: _data.comment_id,
          },
        });
      })
    );

    return response;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "unable to infer mood for comments",
      cause: err,
    });
  }
}
