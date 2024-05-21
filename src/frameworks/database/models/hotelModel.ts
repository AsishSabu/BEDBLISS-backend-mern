import { Schema, model } from "mongoose";

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    place: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyRules: [String],
    aboutProperty: {
      type: String,
      trim: true,
      default: "",
    },
    rooms: [
      {
        type: {
          type: String,
          required: true,
          enum: ["single", "double", "duplex"],
        },
        price: String,
        guests: String,
        number: String,
      },
    ],
    amenities: [String],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    listed: {
      type: Boolean,
      default: true,
    },
    image:{
      type:String
    }
  },
  { timestamps: true }
);

const Hotel = model("Hotel", hotelSchema);
export default Hotel;
