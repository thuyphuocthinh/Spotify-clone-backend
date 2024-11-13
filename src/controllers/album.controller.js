import Album from "../models/album.model.js";
import { checkObjectId } from "../utils/checkId.utils.js";

export const getAllAlbum = async (req, res, next) => {
  try {
    const albums = await Album.find();
    return res.status(200).json({
      success: true,
      message: "success",
      data: albums,
    });
  } catch (error) {
    console.log(">>> error in getting all albums: ", error.message);
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!checkObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid album id",
      });
    }
    // populate => ref
    const albums = await Album.findById(id).populate("songs");
    if (!albums) {
      return res.status(400).json({
        success: false,
        message: "Album not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "success",
      data: albums,
    });
  } catch (error) {
    console.log(">>> error in getting album by id: ", error.message);
    next(error);
  }
};
