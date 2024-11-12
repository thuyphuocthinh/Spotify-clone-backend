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

