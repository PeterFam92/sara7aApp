import { redisClient } from "./redis.connection.js";

export const revokeTokenKeyPrefix = ({ userId }) => {
  return `user:revokeToken:${userId}`;
};

export const revokeTokenKey = ({ userId, jti }) => {
  return `${revokeTokenKeyPrefix({ userId })}:${jti}`;
};

// set a key-value pair
export const set = async ({ key, value, ttl = null }) => {
  try {
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EXAT: ttl,
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis failed to set key-value pair", error);
  }
};

// get a value by key
export const get = async ({ key }) => {
  try {
    const data = await redisClient.get(key);
    return data;
  } catch (error) {
    console.error("Redis failed to get value by key", error);
  }
};

// update a value by key
export const update = async ({ key, value, ttl = null }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        EXAT: ttl,
      });
    } else {
      return await redisClient.set(key, data);
    }
  } catch (error) {
    console.error("Redis failed to update value by key", error);
  }
};

// delete a value by key
export const del = async ({ key }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.del(key);
  } catch (error) {
    console.error("Redis failed to delete value by key", error);
  }
};

// expire a key with an absolute timestamp
export const expire = async ({ key, ttl }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.expireAt(key, ttl);
  } catch (error) {
    console.error("Redis failed to expire key", error);
  }
};

//  TTL of a key
export const ttl = async ({ key }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) return false;
    return await redisClient.ttl(key);
  } catch (error) {
    console.error("Redis failed to get TTL of key", error);
  }
};

// keys pattern
export const keys = async ({ pattern }) => {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error("Redis failed to get keys by pattern", error);
  }
};
