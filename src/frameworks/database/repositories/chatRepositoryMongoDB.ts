import mongoose from "mongoose"
import Conversation from "../models/conversationModel"
import Message from "../models/messageModel"
import { newMessageInterface } from "../../../types/ChatInterface"

export default function chatDbRepository() {
  const isChatExists = async (senderId: string, recieverId: string) =>
    await Conversation.findOne({ members: { $all: [senderId, recieverId] } })

  const getConversationById = async (id: string) =>
    await Conversation.findById(id)

  const addNewChat = async (members: string[]) => {
    return await Conversation.create({ members })
  }
  const getChatsByMembers = async (id: string) =>
    await Conversation.find({ members: { $in: [id] } })

  const addNewMessage = async (newMessageData: newMessageInterface) =>
    await Message.create(newMessageData)

  const messages = async (id: string) =>
    await Message.find({
      conversationId: id,
    })

  return {
    getConversationById,
    addNewChat,
    isChatExists,
    getChatsByMembers,
    addNewMessage,
    messages,
  }
}
export type chatDbRepositoryType = typeof chatDbRepository
