import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({
      clerkId: {
        $ne: currentUserId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "success",
      data: users,
    });
  } catch (error) {
    console.log(">>> get all users error: ", error.message);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
