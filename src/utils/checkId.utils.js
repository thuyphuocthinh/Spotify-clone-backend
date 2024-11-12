import mongoose from "mongoose";

export const checkObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
