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
}, { _id: false }); 


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
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: "Room"
  }],
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
    type: String,
    enum: ["rejected", "cancelled", "pending",'verified'],
    default: "pending",
  },
  hotelDocument: {
    type: String,
  },

  ownerPhoto: {
    type: String,
     
  },
  Reason: {
    type: String,   
  },

 
}, { timestamps: true });



const Hotel = model("Hotel", hotelSchema);
export default Hotel;
