import { Schema, model } from "mongoose";

// Define the address schema
const addressSchema = new Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  landMark: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
}, { _id: false }); // Disable the automatic _id field for the subdocument

// Define the hotel schema
const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  address: {
    type: addressSchema,
    required: true,
  },
  stayType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  propertyRules: [String],
  room: {
    type: Number,
    required: true,
  },
  bed: {
    type: Number,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  amenities: [String],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  imageUrls: [String],
  reservationType: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  hotelDocument: {
    type: String,
  },

  ownerPhoto: {
    type: String,
     
  },

  unavailbleDates: [{ type: Date }],
}, { timestamps: true });

hotelSchema.pre("save", async function (next) {
  const currentDate = new Date();
  this.unavailbleDates = this.unavailbleDates.filter(
    (date: Date) => date >= currentDate
  );
  next();
});

const Hotel = model("Hotel", hotelSchema);
export default Hotel;
