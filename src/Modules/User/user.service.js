import { successResponse } from "../../Utils/response/success.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";

export const getProfile = async (req, res) => {
  req.user.phone = await decrypt(req.user.phone);
  return successResponse({
    res,
    statusCode: 200,
    message: "User found successfully",
    data: req.user,
  });
};
