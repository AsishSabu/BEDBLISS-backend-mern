import { Request, Response, NextFunction } from "express"
import { chatDbInterfaceType } from "../../app/interfaces/chatDbInterface"
import {
  addNewChat,
  getChatById,
  getChats,
  getConverationByMembers,
  getMessages,
  newMessage,
} from "../../app/use-cases/Chat/chat"
import { HttpStatus } from "../../types/httpStatus"
import { chatDbRepositoryType } from "../../frameworks/database/repositories/chatRepositoryMongoDB"

const chatController = (
  chatDbRepository: chatDbInterfaceType,
  chatDbRepositoryImpl: chatDbRepositoryType
) => {
  const dbRepositoryChat = chatDbRepository(chatDbRepositoryImpl())

  const createNewChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const { senderId, receiverId } = req.body

      const chats = await addNewChat(senderId, receiverId, dbRepositoryChat)
      res.status(HttpStatus.OK).json({ success: true, chats })
    } catch (error) {
      next(error)
    }
  }

  const createUserChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const { receiverId, senderId, text,chatId } = req.body   
      let conversationId
      if(!chatId){
        const chats = await addNewChat(senderId, receiverId, dbRepositoryChat)
        conversationId= chats?._id.toString()
      }else{
        conversationId=chatId
      }
      if (conversationId) {
        const message = await newMessage(
          { senderId, conversationId, text },
          dbRepositoryChat
        )
        res.status(HttpStatus.OK).json({ success: true, message })
      }
    } catch (error) {
      next(error)
    }
  }

  const fetchConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const senderId = req.query.senderId as string
      const recieverId = req.query.receiverId as string
      const conversation=await getConverationByMembers(senderId,recieverId,dbRepositoryChat)
      res.status(HttpStatus.OK).json(conversation)
    } catch (error) {
      next(error)
    }
  }

  const fetchChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const senderId = req.user
      const chats = await getChats(senderId, dbRepositoryChat)
      res.status(HttpStatus.OK).json(chats)
    } catch (error) {
      next(error)
    }
  }
 
  const createNewMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const message = await newMessage(req.body, dbRepositoryChat)
      res.status(HttpStatus.OK).json(message)
    } catch (error) {
      next(error)
    }
  }
  /*
   * METHOD:GET
   * Retrive all  messages from  the users
   */
  const fetchMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const converstaionID = req.params.id
      const message = await getMessages(converstaionID, dbRepositoryChat)
      return res.status(HttpStatus.OK).json({ success: true, message })
    } catch (error) {
      next(error)
    }
  }

  return {
    createNewChat,
    fetchChats,
    createNewMessage,
    fetchMessages,
    createUserChat,
    fetchConversation
  }
}
export default chatController
