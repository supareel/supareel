import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .trim()
      .min(1)
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    DATABASE_HOST: z.string().trim().min(1),
    DATABASE_USER: z.string().trim().min(1),
    DATABASE_PASSWORD: z.string().trim().min(1),
    DATABASE_PORT: z.string().trim().min(1),
    DATABASE_NAME: z.string().trim().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().trim().min(1)
        : z.string().trim().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().trim().url()
    ),
    // Add ` on ID and SECRET if you want to make sure they're not empty
    GOOGLE_CLIENT_ID: z.string().trim().min(1),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
    YT_API_KEY: z.string().trim().min(1),
    CLIENT_BASE_URL: z.string().trim().min(1),

    MINDSDB_HOST_URL: z.string().trim().min(1),
    DATASOURCE_NAME: z.string().trim().min(1),
    SENTIMENT_CLASSIFIER: z.string().trim().min(1),
    JOB_INTERVAL_MINUTES: z.string().transform(Number).default("10"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    YT_API_KEY: process.env.YT_API_KEY,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    MINDSDB_HOST_URL: process.env.MINDSDB_HOST_URL,
    DATASOURCE_NAME: process.env.DATASOURCE_NAME,
    SENTIMENT_CLASSIFIER: process.env.SENTIMENT_CLASSIFIER,
    JOB_INTERVAL_MINUTES: process.env.JOB_INTERVAL_MINUTES,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
