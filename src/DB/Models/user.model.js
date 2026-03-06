import mongoose from "mongoose";
import {
  GenderEnum,
  RoleEnum,
  ProviderEnum,
} from "../../Utils/enums/user.enum.js";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minLength: 2,
      maxLength: 25,
    },
    email: {
      type: String,
      required: [true, "Email is required"],

      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },
    DOB: {
      type: Date,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),

      default: GenderEnum.Male,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    phone: {
      type: String,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    confirmEmail: Date,
    profilePicture: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [value];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
