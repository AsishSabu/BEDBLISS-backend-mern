import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    maxAdults: {
      type: Number,
      required: true,
    },
    maxChildren: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    roomNumbers: [
      {
        number: Number,
        unavailableDates: { type: [Date] }
      }
    ],
    listed:{
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


RoomSchema.pre('save', function (next) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day

  this.roomNumbers.forEach((room: any) => {
    room.unavailableDates = room.unavailableDates.filter((date: Date) => date >= today);
  });

  next();
});


const Room = mongoose.model("Room", RoomSchema);
export default Room;
