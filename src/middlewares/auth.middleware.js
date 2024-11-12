import { clerkClient } from "@clerk/express";

export const protectedRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - you must login",
    });
  }
  next();
};

export const requiredAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress.emailAddress;
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - you must be an admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
