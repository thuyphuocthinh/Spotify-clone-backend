import express from "express";
import * as userController from "../controllers/user.controller.js";
import {
  protectedRoute,
  requiredAdmin,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protectedRoute, requiredAdmin, userController.getAllUsers);
router.get("/messages/:userId", protectedRoute, userController.getMessages);

export default router;
