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
exports.getMessages = exports.getChatById = exports.getChats = exports.newMessage = exports.getConverationByMembers = exports.addNewChat = void 0;
const addNewChat = (senderId, recieverId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const isChatExist = yield chatRepository.isChatExists(senderId, recieverId);
    if (isChatExist)
        return isChatExist;
    return yield chatRepository.createNewChat([senderId, recieverId]);
});
exports.addNewChat = addNewChat;
const getConverationByMembers = (senderId, recieverId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield chatRepository.isChatExists(senderId, recieverId); });
exports.getConverationByMembers = getConverationByMembers;
const newMessage = (newMessageData, chatRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield chatRepository.addNewMessage(newMessageData); });
exports.newMessage = newMessage;
const getChats = (senderId, chatRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield chatRepository.getAllConversations(senderId); });
exports.getChats = getChats;
const getChatById = (id, chatRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatRepository.getConversationById(id);
});
exports.getChatById = getChatById;
const getMessages = (conversationID, 
// skip: number,
// limit: number,
chatRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield chatRepository.getMessage(conversationID); });
exports.getMessages = getMessages;
// export const getLatestMessages = async (
//   recieverId: string,
//   chatRepository: ReturnType<chatDbInterfaceType>,
//   conversationID?: string
// ) => {
//   const filter: Record<string, any> = {
//     senderId: recieverId,
//     isRead: false,
//   };
//   conversationID && (filter.conversationId = conversationID);
//   const messages = await chatRepository.getLatestMessage(filter);
//   return messages;
// };
