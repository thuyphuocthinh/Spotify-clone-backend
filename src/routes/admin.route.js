import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import {
  protectedRoute,
  requiredAdmin,
} from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectedRoute);
router.use(requiredAdmin);
router.post("/songs", adminController.createSong);
router.delete("/songs/:id", adminController.deleteSong)

export default router;
