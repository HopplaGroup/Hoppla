import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const menv = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    // AUTH
    KINDE_CLIENT_ID: z.string().min(1),
    KINDE_CLIENT_SECRET: z.string().min(1),
    KINDE_ISSUER_URL: z.string().min(1),
    KINDE_SITE_URL: z.string().min(1),
    KINDE_POST_LOGOUT_REDIRECT_URL: z.string().min(1),
    KINDE_POST_LOGIN_REDIRECT_URL: z.string().min(1),
    PRISMA_USER_CREATION_REDIRECT_URL: z.string().min(1),
    // FILE UPLOAD
    AWS_S3_REGION: z.string().min(1),
    AWS_S3_ACCESS_KEY_ID: z.string().min(1),
    AWS_S3_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
    // BACKEND
    BACKEND_URL: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE: z.string().min(1),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID,
    KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET,
    KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
    KINDE_SITE_URL: process.env.KINDE_SITE_URL,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    PRISMA_USER_CREATION_REDIRECT_URL:
      process.env.PRISMA_USER_CREATION_REDIRECT_URL,

    NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE:
      process.env.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE,

    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,

    BACKEND_URL: process.env.BACKEND_URL,
  },

  skipValidation: true,
});
