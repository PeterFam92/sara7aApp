import express from "express";
import bootstrap from "./src/app.controller.js";
import { config } from "./config/config.service.js";
const app = express();

await bootstrap(app, express);
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
