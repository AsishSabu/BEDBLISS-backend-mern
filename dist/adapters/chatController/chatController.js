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
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("../../app/use-cases/Chat/chat");
const httpStatus_1 = require("../../types/httpStatus");
const chatController = (chatDbRepository, chatDbRepositoryImpl) => {
    const dbRepositoryChat = chatDbRepository(chatDbRepositoryImpl());
    const createNewChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = req.body;
            const chats = yield (0, chat_1.addNewChat)(senderId, receiverId, dbRepositoryChat);
            res.status(httpStatus_1.HttpStatus.OK).json({ success: true, chats });
        }
        catch (error) {
            next(error);
        }
    });
    const createUserChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { receiverId, senderId, text, chatId } = req.body;
            let conversationId;
            if (!chatId) {
                const chats = yield (0, chat_1.addNewChat)(senderId, receiverId, dbRepositoryChat);
                conversationId = chats === null || chats === void 0 ? void 0 : chats._id.toString();
            }
            else {
                conversationId = chatId;
            }
            if (conversationId) {
                const message = yield (0, chat_1.newMessage)({ senderId, conversationId, text }, dbRepositoryChat);
                res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const fetchConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const senderId = req.query.senderId;
            const recieverId = req.query.receiverId;
            const conversation = yield (0, chat_1.getConverationByMembers)(senderId, recieverId, dbRepositoryChat);
            res.status(httpStatus_1.HttpStatus.OK).json(conversation);
        }
        catch (error) {
            next(error);
        }
    });
    const fetchChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const senderId = req.user;
            const chats = yield (0, chat_1.getChats)(senderId, dbRepositoryChat);
            res.status(httpStatus_1.HttpStatus.OK).json(chats);
        }
        catch (error) {
            next(error);
        }
    });
    const createNewMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = yield (0, chat_1.newMessage)(req.body, dbRepositoryChat);
            res.status(httpStatus_1.HttpStatus.OK).json(message);
        }
        catch (error) {
            next(error);
        }
    });
    /*
     * METHOD:GET
     * Retrive all  messages from  the users
     */
    const fetchMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const converstaionID = req.params.id;
            const message = yield (0, chat_1.getMessages)(converstaionID, dbRepositoryChat);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, message });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        createNewChat,
        fetchChats,
        createNewMessage,
        fetchMessages,
        createUserChat,
        fetchConversation
    };
};
exports.default = chatController;
