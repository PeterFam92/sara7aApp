import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../../Middleware/auth.middleware.js";
import { TokenTypeEnum, RoleEnum } from "../../Utils/enums/user.enum.js";
import {
  localFileUpload,
  fileValidation,
} from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  profileImageValidation,
  coverImagesValidation,
} from "./user.validation.js";

const router = Router();

router.get(
  "/",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Access }),
  authorizationMiddleware({ accessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  userService.getProfile,
);

// profile image

router.patch(
  "/update-profile-pic",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Access }),
  authorizationMiddleware({ accessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.images],
  }).single("attachments"),
  validation(profileImageValidation),

  userService.updateProfilePic,
);

// cover image

router.patch(
  "/update-cover-pic",
  authenticationMiddleware({ tokenType: TokenTypeEnum.Access }),
  authorizationMiddleware({ accessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  localFileUpload({
    customPath: "User",
    validation: [...fileValidation.images],
  }).array("attachments", 5),
  validation(coverImagesValidation),

  userService.updateCoverPic,
);

export default router;
