import joi from "joi";
import { generalFields } from "../../Middleware/validation.middleware.js";

export const signupSchema = {
  body: joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword,
    age: generalFields.age,
    phone: generalFields.phone,
  }),
};

export const loginSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }).required(),
};
