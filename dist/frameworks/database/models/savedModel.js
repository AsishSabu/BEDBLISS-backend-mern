"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SavedSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Hotels: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Hotel",
        },
    ],
}, { timestamps: true });
const Saved = mongoose_1.default.model("Saved", SavedSchema);
exports.default = Saved;
