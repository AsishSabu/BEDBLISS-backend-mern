"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratingSchema = new mongoose_1.default.Schema({
    hotelId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Hotel" },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
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
}, { timestamps: true });
const Rating = mongoose_1.default.model("Rating", ratingSchema);
exports.default = Rating;
