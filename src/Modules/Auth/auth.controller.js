import { Router } from "express";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
import { authenticationMiddleware } from "../../Middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { validation } from "../../Middleware/validation.middleware.js";

const router = Router();

router.post(
  "/signup",
  validation(authValidation.signupSchema),
  authService.signUp
);
router.post(
  "/login",
  validation(authValidation.loginSchema),
  authService.logIn
);
router.post(
  "/refresh-token",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Refresh }),
  authService.refreshToken,
);

router.post("/social-login", authService.googleLogin);

export default router;
