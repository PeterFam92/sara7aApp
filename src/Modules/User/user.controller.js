import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../../Middleware/auth.middleware.js";
import { TokenTypeEnum, RoleEnum } from "../../Utils/enums/user.enum.js";

const router = Router();

router.get(
  "/",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Access }),
  authorizationMiddleware({ accessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  userService.getProfile,
);

export default router;
