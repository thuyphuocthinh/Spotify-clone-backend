import cloudinary from "../config/cloudinary.config.js";
import Album from "../models/album.model.js";
import Song from "../models/song.model.js";
import { checkObjectId } from "../utils/checkId.utils.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log(">>> error in upload", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({
        status: false,
        message: "Please upload all files",
      });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json({
      status: true,
      message: "Created a new song successfully",
    });
  } catch (error) {
    console.log(">>> error in createSong: ", error.message);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!checkObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid song id",
      });
    }
    const song = await Song.findById(id);
    // if song belongs to an album => update album
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Deleted song successfully",
    });
  } catch (error) {
    console.log(">>> error in deleteSong: ", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });
    await album.save();
    return res.status(201).json({
      success: true,
      message: "Created a new album successfully",
    });
  } catch (error) {
    console.log(">>> error in create album: ", error.message);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!checkObjectId(id)) {
      return res.status(400).json({
        success: true,
        message: "Invalid album id",
      });
    }
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    return res.status(200).json({
      status: false,
      message: "Deleted album successfully",
    });
  } catch (error) {
    console.log(">>> error in deleting album: ", error.message);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      admin: true,
    });
  } catch (error) {
    console.log(">>> error in check admin: ", error.message);
    next(error);
  }
};
