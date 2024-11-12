import express from "express";
import * as albumController from "../controllers/album.controller.js";
const router = express.Router();

router.get("/all", albumController.getAllAlbum);

export default router;
