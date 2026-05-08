import { successResponse } from "../../Utils/response/success.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";
import UserModel from "../../DB/Models/user.model.js";

import { findByIdAndUpdate } from "../../DB/database.repo.js";

export const getProfile = async (req, res) => {
  req.user.phone = await decrypt(req.user.phone);
  return successResponse({
    res,
    statusCode: 200,
    message: "User found successfully",
    data: req.user,
  });
};

export const updateProfilePic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { profilePic: req.file.finalPath },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Profile pic updated successfully",
    data: { user },
  });
};

export const updateCoverPic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    update: { coverPictures: req.files?.map((file) => file.finalPath) },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Cover picture updated successfully",
    data: { user },
  });
};
