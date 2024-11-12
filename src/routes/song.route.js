import express from "express";
import * as songController from "../controllers/song.controller.js";
import {
  protectedRoute,
  requiredAdmin,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", protectedRoute, requiredAdmin, songController.getAllSongs);
router.get("/featured", songController.getFeaturedSongs);
router.get("/made-for-you", songController.getMadeForYouSongs);
router.get("/trending", songController.getTrendingSongs);

export default router;
