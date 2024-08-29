import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newPlaylist = await Playlist.create(
    {
      name: name,
      description: description,
    },
    {
      timestamps: true,
    },
  );
  if (!newPlaylist) throw new ApiError(500, "Cannot create a new playlist!!");

  return res
    .send(200)
    .json(new ApiResponse(200, newPlaylist, "new Playlist created!!"));

  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(404, "Unauthorized request");
  // return an array of videos
  // const userPlaylist = await Playlist.aggregate([
  //   {
  //     $match: {
  //       owner: "user001",
  //     },
  //   },

  //   {
  //     $project: {
  //       name: 1,
  //       videos: 1,
  //     },
  //   },
  // ]);
  const userPlaylists = await Playlist.find({
    owner: userId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userPlaylists,
        "User Playlists Fetched Successfully",
      ),
    );
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  /*[
  {
    $match: {
       id:"playlist001"
    }
  },
  
  {
    $project: {
      name:1,
      videos:1,
    }
  },
 
]*/
  if (!isValidObjectId(playlistId))
    throw new ApiError(401, "Invalid Playlist Access");
  const playlist = Playlist.findById({ id: playlistId });
  return res
    .send(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched!!"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!(isValidObjectId(playlistId) || isValidObjectId(videoId)))
    throw new ApiError(500, "Invalid Access!!");
  const playlist = Playlist.findById({ id: playlistId });
  if (!playlist.videos.includes(videoIdToRemove)) {
    throw new ApiError(401, "Video not found in the playlist");
  }

  playlist.videos = playlist.videos.filter(
    (videoId) => videoId !== videoIdToRemove,
  );

  // Save the updated playlist
  await playlist.save();

  return res
    .send(200)
    .json(new ApiResponse(200, playlist, "Vidoe deleted successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playist Accesss");
  const response = await Playlist.findByIdAndDelete({ id: playlistId });
  if (!res)
    throw new ApiError(500, "Couldnot Delete Playlist .Try again later");

  return res
    .send(200)
    .json(new ApiResponse(200, {}, "Playlist Deleted Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
