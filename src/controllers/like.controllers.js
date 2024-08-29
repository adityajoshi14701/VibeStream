import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  // check if video id is valid or not
  // find whether the video is liked by the user or not
  // if liked then toggle and vice versa
  // according to that increment and decrement the number of likes of the video

  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) throw new ApiError("400", "Invalid Videos Id");

  const like = await Like.findOne({ video: videoId, likedBy: req.user._id });
  if (like) {
    await Like.delete();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like Removed Successfully"));
  }
  await Like.create({ video: videoId, likedBy: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse("200", {}, "Liked the video succcessfully!!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  // get user id and comment id
  // verify them if they exist or not
  // check if the comment is liked or not already
  // return the response
  const { commentId } = req.params;
  if (!isValidObjectId(commentId))
    throw new ApiError("400", "Invalid Comment Id");
  const comment = Like.findOne({
    comment: commentId,
    likedBy: req.params.user._id,
  });
  if (comment) {
    await Like.delete();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like Removed Successfully"));
  }
  await Like.create({ comment: commentId, likedBy: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse("200", {}, "Liked the video succcessfully!!"));

  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId))
    throw new ApiError("400", "Invalid Comment Id");
  const tweet = Like.findOne({
    tweet: tweetId,
    likedBy: req.params.user._id,
  });
  if (tweet) {
    await Like.delete();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like Removed Successfully"));
  }
  await Like.create({ tweet: tweetId, likedBy: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse("200", {}, "Liked the video succcessfully!!"));
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const userId = req.user._id;
  if (!isValidObjectId(userId)) throw new ApiError("400", "Invalid user ");
  const content = Like.find({ likedBy: userId });
  content
    .then((likes) => {
      const videoLikes = likes.filter((like) => like.video);
      res.status("200", { videoLikes }, "All liked videos fetched ");
      console.log(videoLikes);
    })
    .catch((err) => {
      throw new ApiError("401", "Something went wrong", err);
    });
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
