import express from "express";
import * as adminController from "../controllers/admin.controller.js";
const router = express.Router();

router.get("/", adminController.getAdmin);

export default router;
