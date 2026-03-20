import { Router } from "express";
import * as authService from "./auth.service.js";
import { authenticationMiddleware } from "../../Middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.post("/signup", authService.signUp);
router.post("/login", authService.logIn);
router.post(
  "/refresh-token",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Refresh }),
  authService.refreshToken
);

export default router;
