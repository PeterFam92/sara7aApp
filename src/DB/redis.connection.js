import { config } from "../../config/config.service.js";
import { createClient } from "redis";

export const redisClient = createClient({ url: config.redisUri });

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed", error);
  }
};
