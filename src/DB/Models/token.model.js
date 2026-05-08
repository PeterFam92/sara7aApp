import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// ttl

tokenSchema.index("expiresIn", { expireAfterSeconds: 0 });

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
