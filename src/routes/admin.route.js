import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectedRoute);
router.get("/", adminController.getAdmin);

export default router;
