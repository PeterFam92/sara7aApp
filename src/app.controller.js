import { authRouter, userRouter } from "./Modules/index.js";
import { successResponse } from "./Utils/response/success.response.js";
import {
  globalErrorHandler,
  notFoundException,
} from "./Utils/response/error.response.js";
import dbConnection from "./DB/connection.js";
import cors from "cors";

const bootstrap = async (app, express) => {
  dbConnection();
  app.get("/", (req, res) => {
    return successResponse({
      res,
      statusCode: 201,
      message: "Welcome to the Sara7a API",
    });
  });
  app.use(express.json(), cors());
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.all("/*dummy", (req, res) => {
    throw notFoundException({ message: "Not Found Handler" });
  });
  app.use(globalErrorHandler);
};
export default bootstrap;
