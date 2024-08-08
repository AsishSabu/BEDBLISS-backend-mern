import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookingId:{type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
    imageUrls: [String]
  },
  { timestamps: true }
)

const Rating = mongoose.model("Rating", ratingSchema)
export default Rating
