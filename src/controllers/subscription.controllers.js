import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { channel, subscribe } from "diagnostics_channel";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId))
    throw new ApiError(400, "Channel id is not valid");
  const isSubscribed = Subscription.findOne({ channel: channelId });
  if (!isSubscribed) {
    await Subscription.create({ channel: channelId });
    return res
      .send(200)
      .json(new ApiResponse(200, {}, "Subscribed successfully"));
  }

  await Subscription.deleteOne({ channel: channelId })
    .then(() => {
      return res.send(200).json(200, {}, "Unsubscribed Successfully");
    })
    .catch((err) => {
      throw new ApiError(500, "Internall Database Error");
    });
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId))
    throw new ApiError(400, "channel id is not valid !!!");

  const subscribers = await Subscription.findOne({ channel: channelId }).map(
    (channel) => channel.subscriber,
  );
  if (!subscribers)
    return res
      .send(200)
      .json(new ApiResponse(200, {}, "Channels doesn't have subscibers"));

  return res
    .send(200)
    .json(
      new ApiResponse(
        200,
        { subscribers },
        "Subscribers fetched successfully!!!",
      ),
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId))
    throw new ApiError(400, "channel id is not valid !!!");

  const channles = await Subscription.findOne({
    subscriber: subscriberId,
  }).map((subscription) => subscription.channel);
  if (!channles)
    return res
      .send(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Subscriber don not have any channel subscribed",
        ),
      );

  return res
    .send(200)
    .json(
      new ApiResponse(
        200,
        { subscribers },
        "Subscribers fetched successfully!!!",
      ),
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
