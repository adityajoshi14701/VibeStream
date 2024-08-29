import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  let getAllComments;
  try {
    getAllComments = Comment.aggregate([
      {
        // this will return the documnets with the video id
        $match: {
          video: "$videoId",
        },
      },
      {
        $project: {
          content: 1,
        },
      },

      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    if (!getAllComments)
      return new ApiResponse(404, {}, "Comments not Found !!!");

    return new ApiResponse(
      200,
      getAllComments,
      "Commnets Fetched Successfully !!",
    );
  } catch (error) {
    return new ApiError(400, "Comments couldn't be fetched");
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const content = req.body;
  if (!content) throw new ApiError(400, "No Comment is being sent !!");
  const videoId = req.params;
  const userId = req.user_id;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User Id");
  const comment = {
    content: content,
    video: videoId,
    owner: userId,
  };
  await Comment.create(comment, {
    new: true,
  })
    .then((tweet) => {
      console.log(tweet);
      res
        .status(200)
        .json(
          new ApiResponse("200", { comment }, "Comment created successfully"),
        );
    })
    .catch((err) => {
      throw new ApiError("401", "Error while creating Comment", err);
    });
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const commentId = req.parama.commentId;
  if (!commentId) throw new ApiError(400, "This Tweet doesn't exist");
  const newContent = req.body;
  await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent,
      },
    },
    { new: true },
  )
    .then((comment) => {
      return res
        .status(200)
        .json(
          new ApiResponse(201, { comment }, "comment Updated succeessfully"),
        );
    })
    .catch((err) => {
      return res.status(500).json(new ApiError(500, "Errorin updating file"));
    });
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const commentId = req.parama.commentId;
  if (!commentId) throw new ApiError(400, "This commentId doesn't exist");

  try {
    await Comment.findByIdAndDelete(commentId, (err, response) => {
      if (err) console.log(err);
      else {
        console.log("Deleted Successful!!", response);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
