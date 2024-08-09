import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: "string",
      default: function () {
        return `BBLiss-${new Date().getTime().toString()}-${Math.floor(
          Math.random() * 10000
        )
          .toString()
          .padStart(4, "0")}`
      },
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      require: true,
    },
    lastName: {
      type: String,
      trim: true,
      require: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
      require: true,
    },
    email: {
      type: String,
      trim: true,
      require: true,
    },
    address: {
      type: String,
      trim: true,
      require: true,
    },
    hotelId: {
      type: mongoose.Types.ObjectId,
      trim: true,
      require: true,
      ref: "Hotel",
    },
    rooms: [],
    userId: {
      type: mongoose.Types.ObjectId,
      trim: true,
      require: true,
      ref: "User",
    },

    maxAdults: {
      type: Number,
      trim: true,
    },
    maxChildren: {
      type: Number,
      trim: true,
    },
    checkInDate: {
      type: Date,
      trim: true,
      require: true,
    },
    checkOutDate: {
      type: Date,
      trim: true,
      require: true,
    },
    totalDays: {
      type: Number,
      require: true,
    },
    totalRooms: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      trim: true,
      require: true,
    },
    platformFee: {
      type: Number,
      trim: true,
      require: true,
    },
    Reason: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Online", "Wallet", "pay_on_checkout"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    bookingStatus: {
      type: String,
      enum: [
        "booked",
        "rejected",
        "cancelled",
        "pending",
        "cancelled with refund",
        "cancel requested",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
)

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking
