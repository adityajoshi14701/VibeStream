import mongoose, { Schema } from "mongoose";

const tweetSchema = Schema(
  {
    content: {
      type: String,
      requried: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);
export const Tweet = mongoose.model("Tweet", tweetSchema);
