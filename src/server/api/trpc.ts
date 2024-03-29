/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { type YouTubeChannelDetails } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  const ytChannel: YouTubeChannelDetails = {
    id: 0,
    yt_channel_customurl: "",
    yt_channel_id: "",
    yt_channel_published_at: null,
    yt_channel_thumbnails: "",
    yt_channel_title: "",
  };

  return {
    db,
    session,
    ...opts,
    ytChannel,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
/** Reusable middleware that enforces users are logged in before running the procedure. */
const ytAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const userYtChannel: YouTubeChannelDetails | null =
      await ctx.db.youTubeChannelDetails.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

    // if access token expired, refresh it
    // TODO: Figure out a way to refresh the tokens
    // oauth2Client.on("tokens", (tokens) => {
    //   if (tokens.refresh_token) {
    //     void db.youTubeChannelDetails.update({
    //       where: {
    //         id_token: {
    //           startsWith:
    //         },
    //       },
    //       data: {
    //         access_token: tokens.access_token ?? "",
    //         expiry_date: tokens.expiry_date ?? 0,
    //         id_token: tokens.id_token ?? "",
    //         refresh_token: tokens.refresh_token ?? "",
    //       },
    //     });
    //   }
    // });
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
        ytChannel: userYtChannel,
      },
    });
  } catch (err) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Youtube channel of user not connected",
      cause: "Youtube access-token/refresh-token not found",
    });
  }
});
export const ytProtectedProcedure = t.procedure
  .use(enforceUserIsAuthed)
  .use(ytAuthed);
