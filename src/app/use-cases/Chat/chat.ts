import { newMessageInterface } from "../../../types/ChatInterface"
import { chatDbInterfaceType } from "../../interfaces/chatDbInterface"

export const addNewChat = async (
  senderId: string,
  recieverId: string,
  chatRepository: ReturnType<chatDbInterfaceType>
) => {
  const isChatExist = await chatRepository.isChatExists(senderId, recieverId)
  if (isChatExist) return isChatExist
  return await chatRepository.createNewChat([senderId, recieverId])
}

export const getConverationByMembers=async(
  senderId:string,
  recieverId:string,
  chatRepository: ReturnType<chatDbInterfaceType>
)=>await chatRepository.isChatExists(senderId, recieverId)


export const newMessage = async (
  newMessageData: newMessageInterface,
  chatRepository: ReturnType<chatDbInterfaceType>
) => await chatRepository.addNewMessage(newMessageData)

export const getChats = async (
  senderId: string,
  chatRepository: ReturnType<chatDbInterfaceType>
) => await chatRepository.getAllConversations(senderId)

export const getChatById = async (
  id: string,
  chatRepository: ReturnType<chatDbInterfaceType>
) => {
  return await chatRepository.getConversationById(id)
}

export const getMessages = async (
  conversationID: string,
  // skip: number,
  // limit: number,
  chatRepository: ReturnType<chatDbInterfaceType>
) => await chatRepository.getMessage(conversationID)

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
