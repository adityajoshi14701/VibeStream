import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { response } from "express";

const createTweet = asyncHandler(async (req, res) => {
  // get user id and content
  // validate the user
  // create a tweet object
  // save it in dbms
  // return response

  //TODO: create tweet
  const { content } = req.body;
  const owner = req.user._id;
  if (!isValidObjectId(owner)) throw new ApiError("400", "Invalid user id");

  await Tweet.create({ owner: owner, conent: content })
    .then((tweet) => {
      console.log(tweet);
      res
        .status(200)
        .json(new ApiResponse("200", { tweet }, "Tweet created successfully"));
    })
    .catch((err) => {
      throw new ApiError("401", "Error while creating tweet", err);
    });
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  // get user
  // find user in the tweet model
  // check if there is ny tweet by user
  // if yes retrun the tweets
  const userId = req.params.user._id;
  if (!isValidObjectId(owner)) throw new ApiError("400", "Invalid user id");
  const response = Tweet.find({ owner: userId });
  if (!response)
    return res.status(404).json(new ApiResponse(404, {}, "User doesn't exist"));
  const tweets = response.map((tweet) => tweet.content);
  if (!tweets)
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User doesn't have any tweets"));

  return res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "Twwets fetched succesfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const tweetId = req.parama.tweetId;
  if (!tweetId) throw new ApiError(400, "This Tweet doesn't exist");
  const newContent = req.body;
  await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: newContent,
      },
    },
    { new: true },
  )
    .then((tweet) => {
      return res
        .status(200)
        .json(new ApiResponse(201, { tweet }, "Tweet Updated succeessfully"));
    })
    .catch((err) => {
      return res.status(500).json(new ApiError(500, "Errorin updating file"));
    });

  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const tweetId = req.parama.tweetId;
  if (!tweetId) throw new ApiError(400, "This Tweet doesn't exist");

  try {
    await Tweet.findByIdAndDelete(tweetId, (err, response) => {
      if (err) console.log(err);
      else {
        console.log("Deleted Successful!!", response);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
