import { chatDbRepositoryType } from "../../frameworks/database/repositories/chatRepositoryMongoDB"
import { newMessageInterface } from "../../types/ChatInterface"

export const chatDbInterface = (
  repository: ReturnType<chatDbRepositoryType>
) => {
  const isChatExists = async (senderId: string, recieverId: string) =>
    repository.isChatExists(senderId, recieverId)

  const getConversationById = async (id: string) =>
    repository.getConversationById(id)

  const createNewChat = async (members: string[]) =>
    await repository.addNewChat(members)

  const getAllConversations = async (id: string) =>
    await repository.getChatsByMembers(id)

  const addNewMessage = async (newMessageData: newMessageInterface) =>
    await repository.addNewMessage(newMessageData)

  const getMessage = async (id:string) =>
    await repository.messages(id)

  // const getLatestMessage = async (filter: Record<string, any>) =>
  //   await repository.messages(filter)

  return {
    isChatExists,
    createNewChat,
    getConversationById,
    getAllConversations,
    addNewMessage,
    getMessage,
    // getLatestMessage,
  }
}

export type chatDbInterfaceType = typeof chatDbInterface
