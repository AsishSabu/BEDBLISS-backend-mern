"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpModel = new mongoose_1.default.Schema({
    otp: {
        type: String
    },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
otpModel.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
exports.default = mongoose_1.default.model("OTP", otpModel);
