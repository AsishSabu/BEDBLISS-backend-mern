"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversationModel_1 = __importDefault(require("../models/conversationModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
function chatDbRepository() {
    const isChatExists = (senderId, recieverId) => __awaiter(this, void 0, void 0, function* () { return yield conversationModel_1.default.findOne({ members: { $all: [senderId, recieverId] } }); });
    const getConversationById = (id) => __awaiter(this, void 0, void 0, function* () { return yield conversationModel_1.default.findById(id); });
    const addNewChat = (members) => __awaiter(this, void 0, void 0, function* () {
        return yield conversationModel_1.default.create({ members });
    });
    const getChatsByMembers = (id) => __awaiter(this, void 0, void 0, function* () { return yield conversationModel_1.default.find({ members: { $in: [id] } }); });
    const addNewMessage = (newMessageData) => __awaiter(this, void 0, void 0, function* () { return yield messageModel_1.default.create(newMessageData); });
    const messages = (id) => __awaiter(this, void 0, void 0, function* () {
        return yield messageModel_1.default.find({
            conversationId: id,
        });
    });
    return {
        getConversationById,
        addNewChat,
        isChatExists,
        getChatsByMembers,
        addNewMessage,
        messages,
    };
}
exports.default = chatDbRepository;
