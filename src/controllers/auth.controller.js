import User from "../models/user.model.js";

export const callback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      // sign up
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.log(">>> error in callback: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
