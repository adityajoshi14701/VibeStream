import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) throw new ApiError(500, "Invalid Video !!");

  const video = Video.findById({ id: videoId });
  if (!video) return res.send(404, "Vidoe not found!!");
  return res.send(200).json(new ApiResponse(201, video, "Video fetched!!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Access");
  const { title, description, thumbnail } = req?.body;
  const response = Video.findByIdAndUpdate({
    $set: {
      title: title,
      description: description,
      thumbnail: thumbnail,
    },
  });
  if (!response)
    return res
      .send(500)
      .json(
        new ApiError(500, "Internal Server error(Video cannot be updated)"),
      );
  return res
    .send(200)
    .json(new ApiResponse(201, {}, "Video Updated Successfully!!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");
  const response = Video.findByIdAndDelete({ id: videoId });
  if (!response)
    return res
      .send(500)
      .json(new ApiError(500, "Internal Server Error (deletion of video"));

  return res
    .send(200)
    .json(new ApiResponse(201, {}, "Video Deleted successfully!!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Vido Id");
  const video = Video.findByIdAndUpdate(
    { id: videoId },
    {
      $set: {
        isPublished: !isPublished,
      },
    },
  );
  return res
    .send(200)
    .json(
      new ApiResponse(
        200,
        { video },
        "Updated Published status successfully!!",
      ),
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
