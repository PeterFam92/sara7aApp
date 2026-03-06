import mongoose from "mongoose";
import { config } from "../../config/config.service.js";

export const dbConnection = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    await mongoose.connect(config.dbUri);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
export default dbConnection;
