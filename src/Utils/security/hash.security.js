import { hash, compare } from "bcrypt";
import * as argon2 from "argon2";
import { HashEnum } from "../enums/security.enum.js";
import { config } from "../../../config/config.service.js";

export const generateHash = async ({
  plainTextPassword,
  saltRounds = config.saltRounds,
  algo = HashEnum.BCRYPT,
}) => {
  let hashResult = "";
  switch (algo) {
    case HashEnum.BCRYPT:
      hashResult = await hash(plainTextPassword, saltRounds);
      break;
    case HashEnum.ARGON:
      hashResult = await argon2.hash(plainTextPassword);
      break;
    default:
      hashResult = await hash(plainTextPassword, saltRounds);
      break;
  }
  return hashResult;
};

export const compareHash = async ({
  plainTextPassword,
  cipherText,
  algo = HashEnum.BCRYPT,
}) => {
  let compareResult = false;
  switch (algo) {
    case HashEnum.BCRYPT:
      compareResult = await compare(plainTextPassword, cipherText);
      break;
    case HashEnum.ARGON:
      compareResult = await argon2.verify(cipherText, plainTextPassword);
      break;
    default:
      compareResult = await compare(plainTextPassword, cipherText);
      break;
  }
  return compareResult;
};
