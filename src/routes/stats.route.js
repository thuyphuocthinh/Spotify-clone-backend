import express from "express";
import * as statsController from "../controllers/stats.controller.js";
import {
  protectedRoute,
  requiredAdmin,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protectedRoute, requiredAdmin, statsController.getStats);

export default router;
