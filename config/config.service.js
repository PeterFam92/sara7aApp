import dotenv from "dotenv";
import { resolve } from "node:path";

const envPath = {
  development: `.env.dev`,
  production: `.env.prod`,
};

dotenv.config({ path: resolve(`./config/${envPath.development}`) });

export const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
  saltRounds: Number(process.env.SALT_ROUNDS),
  encryptionSecretKey: process.env.ENCRYPTION_SECRET_KEY,
  //user
  userAccessTokenSecret: process.env.ACCESS_TOKEN_SECRET_USER,

  userRefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET_USER,

  //admin
  adminAccessTokenSecret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
  adminRefreshTokenSecret: process.env.ADMIN_REFRESH_TOKEN_SECRET,

  //common
  refreshTokenExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION),
  accessTokenExpiration: Number(process.env.ACCESS_TOKEN_EXPIRATION),

  //social login
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};
