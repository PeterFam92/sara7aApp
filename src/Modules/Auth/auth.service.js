import { create, findOne } from "../../DB/database.repo.js";
import UserModel from "../../DB/Models/user.model.js";
import {
  badRequestException,
  conflictException,
} from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { notFoundException } from "../../Utils/response/error.response.js";
import { generateHash } from "../../Utils/security/hash.security.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";

export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  //   chech if user exists
  if (await findOne({ model: UserModel, filter: { email } }))
    throw conflictException({ message: "User already exists" });

  const hashedPassword = await generateHash({
    plainTextPassword: password,
    algo: HashEnum.ARGON,
  });

  const user = await create({
    model: UserModel,
    data: { firstName, lastName, email, password: hashedPassword },
  });
  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { user },
  });
};

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

  return successResponse({
    res,
    statusCode: 200,
    message: "User logged in successfully",
    data: { user },
  });
};
