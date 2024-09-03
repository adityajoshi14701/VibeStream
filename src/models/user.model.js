import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required "],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
// don't use arrow function in this pre hook as this refrence is not available in it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//.methods help us to create custom methods for the schema
userSchema.methods.isPasswordCorrect = async function (password) {
  console.log("Plaintext password:", password);
  console.log("Hashed password:", this.password);

  if (!password || !this.password) {
    throw new Error("Password or hash is missing");
  }

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  console.log("enterd the function");
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = function () {
  console.log("enterd the Rfunction");

  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SCERET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  return jwtToken;
};
export const User = mongoose.model("User", userSchema);
