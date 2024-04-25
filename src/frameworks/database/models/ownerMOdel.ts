import {Schema,model} from "mongoose";
const ownerSchema = new Schema(
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
    role: {
      type: String,
      enum: ["owner"],
      default: "owner",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Owner=model("Owner",ownerSchema)

export default Owner
