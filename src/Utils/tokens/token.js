import jwt from "jsonwebtoken";
import { config } from "../../../config/config.service.js";
import { signatureEnum, RoleEnum } from "../enums/user.enum.js";
import { v4 as uuidv4 } from "uuid";
export const generateToken = ({
  payload,
  secretKey = config.userAccessTokenSecret,
  options = { expiresIn: config.accessTokenExpiration },
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({
  token,
  secretKey = config.accessTokenSecret,
}) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = signatureEnum.User }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case signatureEnum.User:
      signature.accessSignature = config.userAccessTokenSecret;
      signature.refreshSignature = config.userRefreshTokenSecret;
      break;
    case signatureEnum.Admin:
      signature.accessSignature = config.adminAccessTokenSecret;
      signature.refreshSignature = config.adminRefreshTokenSecret;
      break;
    default:
      signature.accessSignature = config.userAccessTokenSecret;
      signature.refreshSignature = config.userRefreshTokenSecret;
  }
  return signature;
};
export const getNewCredentials = async (user) => {
  const signature = await getSignature({
    signatureLevel:
      user.role !== RoleEnum.Admin ? signatureEnum.User : signatureEnum.Admin,
  });
  const jwtid = uuidv4();

  const accessToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.accessSignature,
    options: { expiresIn: config.accessTokenExpiration, jwtid },
  });
  const refreshToken = generateToken({
    payload: { id: user._id },
    secretKey: signature.refreshSignature,
    options: { expiresIn: config.refreshTokenExpiration, jwtid },
  });
  return { accessToken, refreshToken };
};
