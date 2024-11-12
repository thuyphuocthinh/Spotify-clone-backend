import Song from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    // -1 = Descending => newest to oldest
    // 1 = Ascending => oldest to newest
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Success",
      data: songs,
    });
  } catch (error) {
    console.log(">>> error in getting all songs: ", error.message);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {
          size: 6,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "success",
      data: songs,
    });
  } catch (error) {
    console.log(">>> get featured songs error: ", error.message);
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {
          size: 4,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "success",
      data: songs,
    });
  } catch (error) {
    console.log(">>> get featured songs error: ", error.message);
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: {
          size: 4,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "success",
      data: songs,
    });
  } catch (error) {
    console.log(">>> get featured songs error: ", error.message);
    next(error);
  }
};
