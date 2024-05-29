import { Schema, model } from "mongoose"

const hotelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    destination: {
      type: String,
      required: true,
    },
    address: {
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
      type: String,
      required: true,
    },
    bed: {
      type: String,
      required: true,
    },
    bathroom: {
      type: String,
      required: true,
    },
    guests: {
      type: String,
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
    unavailbleDates: [{ type: Date }],
  },
  { timestamps: true }
)

hotelSchema.pre("save", async function (next) {
  const currentDate = new Date()
  this.unavailbleDates = this.unavailbleDates.filter(
    (date: Date) => date >= currentDate
  )
  next()
})

const Hotel = model("Hotel", hotelSchema)
export default Hotel
