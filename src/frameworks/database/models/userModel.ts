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
      type: String,  
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
    role:{
      type:String,
      default:"user"
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },

    isBlocked:{
      type:Boolean,
      default:false,
    },
    verificationCode: String,
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
