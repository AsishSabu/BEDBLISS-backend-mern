"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportingSchema = new mongoose_1.default.Schema({
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    bookingId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Booking" },
    reason: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    action: {
        type: String,
        enum: ["pending", "rejected", "blocked Hotel", "blocked Owner"],
        default: "pending",
    },
}, { timestamps: true });
const Report = mongoose_1.default.model("Report", reportingSchema);
exports.default = Report;
