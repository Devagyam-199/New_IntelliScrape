import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passHash: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken:{
      type: String,
      index: true,
    }
    
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
