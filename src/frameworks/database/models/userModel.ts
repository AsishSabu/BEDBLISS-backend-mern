import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      maxlength: 10,
    },
    password: {
      type: String,
      trim: true,
    },
    profilePic: {
      type: String,
      trim: true,
      default: "",
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    isBlocked:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
