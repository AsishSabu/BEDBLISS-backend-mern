"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
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
    listed: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
RoomSchema.pre('save', function (next) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day
    this.roomNumbers.forEach((room) => {
        room.unavailableDates = room.unavailableDates.filter((date) => date >= today);
    });
    next();
});
const Room = mongoose_1.default.model("Room", RoomSchema);
exports.default = Room;
