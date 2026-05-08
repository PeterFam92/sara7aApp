import { create, findOne, updateOne } from "../../DB/database.repo.js";
import UserModel from "../../DB/Models/user.model.js";
import {
  badRequestException,
  conflictException,
  notFoundException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import {
  compareHash,
  generateHash,
} from "../../Utils/security/hash.security.js";
import { encrypt } from "../../Utils/security/encryption.security.js";
import { getNewCredentials } from "../../Utils/tokens/token.js";
import { ProviderEnum, LogoutTypeEnum } from "../../Utils/enums/user.enum.js";
import { OAuth2Client } from "google-auth-library";
import { config } from "../../../config/config.service.js";
import TokenModel from "../../DB/Models/token.model.js";
import { set, revokeTokenKey } from "../../DB/redis.service.js";

//signup

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  //   chech if user exists
  if (await findOne({ model: UserModel, filter: { email } }))
    throw conflictException({ message: "User already exists" });

  const hashedPassword = await generateHash({
    plainTextPassword: password,
    algo: HashEnum.ARGON,
  });
  const encryptedData = await encrypt(phone);
  const user = await create({
    model: UserModel,
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: encryptedData,
    },
  });
  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { user },
  });
};

//login

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne({ model: UserModel, filter: { email } });
  if (!user) throw notFoundException({ message: "User not found" });

  const isPasswordMatched = await compareHash({
    plainTextPassword: password,
    cipherText: user.password,
    algo: HashEnum.ARGON,
  });
  if (!isPasswordMatched)
    throw badRequestException({ message: "Invalid password" });
  const credentials = await getNewCredentials(user);

  return successResponse({
    res,
    statusCode: 200,
    message: "User logged in successfully",
    data: { credentials },
  });
};

//refresh token

export const refreshToken = async (req, res) => {
  const user = req.user;
  const { accessToken } = await getNewCredentials(user);
  return successResponse({
    res,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: { accessToken },
  });
};

//google login

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });
  return ticket.getPayload();
}

export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  const { email, picture, given_name, family_name, email_verified } =
    await verifyGoogleAccount({ idToken });

  if (!email_verified) {
    throw badRequestException({ message: "Email Not Verified" });
  }

  const user = await findOne({ model: UserModel, filter: { email } });

  if (user) {
    // login
    if (user.provider === ProviderEnum.Google) {
      const credentials = await getNewCredentials(user);
      return successResponse({
        res,
        message: "Login Successfully with Google",
        data: { credentials },
        statusCode: 200,
      });
    } else {
      throw conflictException({
        message:
          "Email already registered with another provider. Please login with your password or Facebook.",
      });
    }
  }

  // create user
  const newUser = await create({
    model: UserModel,
    data: [
      {
        firstName: given_name,
        lastName: family_name,
        email,
        profilePic: picture,
        provider: ProviderEnum.Google,
      },
    ],
  });

  const credentials = await getNewCredentials(newUser);
  return successResponse({
    res,
    message: "User created successfully and logged in with Google",
    data: { credentials },
    statusCode: 201,
  });
};

//logout

export const logout = async (req, res) => {
  const { flag } = req.body;
  let status = 200;

  switch (flag) {
    case LogoutTypeEnum.LogoutFromCurrentDevice:
      await create({
        model: TokenModel,
        data: [
          {
            jti: req.decodedToken.jti,
            userId: req.user._id,
            expiresIn: new Date(req.decodedToken.exp * 1000),
          },
        ],
      });
      status = 201;
      break;
    case LogoutTypeEnum.LogoutFromAllDevices:
      await updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        update: { changeCredentialsTime: Date.now() },
      });
      status = 200;
      break;
  }

  return successResponse({
    res,
    statusCode: status,
    message: "User logged out successfully",
  });
};

//  logout with redis
export const logoutWithRedis = async (req, res) => {
  const { flag } = req.body;
  let status = 200;

  switch (flag) {
    case LogoutTypeEnum.LogoutFromCurrentDevice:
      await set({
        key: revokeTokenKey({
          userId: req.user._id,
          jti: req.decodedToken.jti,
        }),
        value: req.decodedToken.jti,
        ttl: req.decodedToken.iat + config.accessTokenExpiration,
      });

      status = 201;
      break;
    case LogoutTypeEnum.LogoutFromAllDevices:
      await set({
        key: revokeTokenKey({ userId: req.user._id }),
        value: req.user._id,
        ttl: req.decodedToken.iat + config.refreshTokenExpiration,
      });
      status = 200;
      break;
  }

  return successResponse({
    res,
    statusCode: status,
    message: "User logged out successfully",
  });
};
