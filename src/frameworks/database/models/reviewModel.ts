import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    imageUrls: [String]
  },
  { timestamps: true }
)

const Rating = mongoose.model("Rating", ratingSchema)
export default Rating
