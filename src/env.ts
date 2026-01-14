import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These variables are only available on the server
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DOCUMENTUM_API_URL: z.url().optional(),
    DOCUMENTUM_API_KEY: z.string().min(1).optional(),
    DATABASE_URL: z.url().optional(),
  },

  /**
   * Client-side environment variables schema
   * These variables are exposed to the client (prefixed with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    NEXT_PUBLIC_APP_NAME: z.string().default("Documentum"),
  },

  /**
   * Runtime environment variables
   * Destructure all variables from `process.env` to ensure they're available
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DOCUMENTUM_API_URL: process.env.DOCUMENTUM_API_URL,
    DOCUMENTUM_API_KEY: process.env.DOCUMENTUM_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  /**
   * Skip validation during build time for CI/CD
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined
   */
  emptyStringAsUndefined: true,
});
