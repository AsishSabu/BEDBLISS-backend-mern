import mongoose from "mongoose"

const reportingSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    reason: {
      type: String,
      required: true,
    },
    isRead:{
        type:Boolean,
        default:false,
      },
      action: {
        type: String,
        enum: ["pending", "rejected", "blocked Hotel","blocked Owner"],
        default: "pending",
      },
  },
  { timestamps: true }
)

const Report = mongoose.model("Report", reportingSchema)
export default Report
