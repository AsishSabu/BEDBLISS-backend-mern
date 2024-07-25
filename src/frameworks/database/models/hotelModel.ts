import { Schema, model } from "mongoose"

const defaultCancellationPolicies = [
  {
    name: "Standard Rate Reservations",
    terms: {
      freeCancellation:
        "Guests can cancel their reservation free of charge up to 7 days before the check-in date.",
      lateCancellation:
        "If a reservation is canceled within 7 days and before 2 days of the check-in date, a cancellation fee equivalent to the first night's stay will be charged.",
      noShow:
        "If the guest does not arrive and does not cancel the reservation before 2 days, the full reservation amount will be charged.",
    },
  },
  {
    name: "Non-Refundable Rate Reservations",
    terms: {
      nonRefundable:
        "Reservations made under non-refundable rates cannot be canceled or modified. The full amount of the reservation will be charged at the time of booking and is non-refundable.",
    },
  },
  {
    name: "Group Bookings (5 or more rooms)",
    terms: {
      freeCancellation:
        "Group bookings can be canceled free of charge up to 10 days before the check-in date.",
      lateCancellation:
        "If a group booking is canceled within 10 days and before 2 days of the check-in date, a cancellation fee equivalent to 50% of the total booking amount will be charged.",
      noShow:
        "If the group does not arrive and does not cancel the reservation before 2 days, the full reservation amount will be charged.",
    },
  },
  {
    name: "Refund Processing",
    terms: {
      refundTimeline:
        "Refunds for cancellations will be processed within 7-10 business days from the date of cancellation.",
      refundMethod: "Refunds will be issued to your wallet.",
    },
  },
]

// Define the address schema
const addressSchema = new Schema(
  {
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
  },
  { _id: false }
)

const offerSchema = new Schema(
  {
    type: {
      type: String,
    },
    desc: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    amount: {
      type: Number,
    },
    minAmount: {
      type: Number,
    },
    maxAmount: {
      type: Number,
    },
  },
  { _id: false }
)

// const coordinateSchema = new Schema(
//   {
//     latitude: {
//       type: Number,
//       required: true,
//     },
//     longitude: {
//       type: Number,
//       required: true,
//     },
//   },
//   { _id: false }
// )

const hotelSchema = new Schema(
  {
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
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyRules: [String],
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
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
    isVerified: {
      type: String,
      enum: ["rejected", "cancelled", "pending", "verified"],
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
    offer: offerSchema,
    rating: [],
    cancellationPolicies: {
      type: Array,
      default: () => defaultCancellationPolicies,
    },
  },
  { timestamps: true }
)

const Hotel = model("Hotel", hotelSchema)
export default Hotel
