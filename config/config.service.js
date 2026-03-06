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
};
