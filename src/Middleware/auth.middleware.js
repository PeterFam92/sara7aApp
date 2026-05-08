import { TokenTypeEnum, signatureEnum } from "../Utils/enums/user.enum.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.js";
import {
  badRequestException,
  notFoundException,
  unAuthorizedException,
} from "../Utils/response/error.response.js";
import { findById, findOne } from "../DB/database.repo.js";
import UserModel from "../DB/Models/user.model.js";
import { get, revokeTokenKey } from "../DB/redis.service.js";

import TokenModel from "../DB/Models/token.model.js";

export const resolveToken = async ({
  authorization,
  tokenType = TokenTypeEnum.Access,
}) => {
  const [Bearer, token] = authorization?.split(" ") || [];
  if (!Bearer || !token)
    throw badRequestException({ message: "Invalid token format" });

  const signatureLevel =
    Bearer === "Admin" ? signatureEnum.Admin : signatureEnum.User;
  let signature = await getSignature({ signatureLevel });

  const decodedToken = await verifyToken({
    token,
    secretKey:
      tokenType === TokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });
  // check if token is revoked -->logout

  // if (await findOne({ model: TokenModel, filter: { jti: decodedToken.jti } }))
  //   throw unAuthorizedException({ message: "Token is Revoked" });

  const isRevoked = await get({
    key: revokeTokenKey({
      userId: decodedToken.id,
      jti: decodedToken.jti,
    }),
  });
  if (isRevoked) throw unAuthorizedException({ message: "Token is Revoked" });

  const user = await findById({ model: UserModel, id: decodedToken.id });
  if (!user) throw notFoundException({ message: "User not found" });
  if (user.changeCredentialsTime?.getTime() >= decodedToken.iat * 1000)
    throw unAuthorizedException({ message: "Token is Expired" });
  return { user, decodedToken };
};

export const authenticationMiddleware = ({
  tokenType = TokenTypeEnum.Access,
}) => {
  return async (req, res, next) => {
    try {
      const { user, decodedToken } =
        (await resolveToken({
          authorization: req.headers?.authorization,
          tokenType,
        })) || {};
      req.user = user;
      req.decodedToken = decodedToken;
      return next();
    } catch (error) {
      if (
        error?.name === "JsonWebTokenError" ||
        error?.name === "TokenExpiredError"
      ) {
        error.status = 401;
        error.message = "Invalid or expired token";
      }
      return next(error);
    }
  };
};
export const authorizationMiddleware = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      throw unAuthorizedException({ message: "Unauthorized Access" });
    }
    return next();
  };
};
