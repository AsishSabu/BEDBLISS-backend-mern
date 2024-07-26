import { Server } from "socket.io"
interface SocketUserInterface {
  userId: string
  socketId: string
}

const socketConfig = (io: Server) => {
  let users: SocketUserInterface[] = []

  function addUsers(userId: string, socketId: string) {
    const isUserPresent = users.some(user => user.userId === userId)
    if (!isUserPresent) return users.push({ userId, socketId })
  }
  function removeUser(socketId: string) {
    return (users = users.filter(user => user.socketId !== socketId))
  }

  function getUser(userId: string) {
    return users.find(user => user.userId === userId)
  }

  io.on("connection", socket => {
    // when connection established
    io.emit("welcome", "hello this is socket server")

    socket.on("addUser", userId => {
      // take userid and socketId from user
      addUsers(userId, socket.id)
      io.emit("getUsers", users)
    })
    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
      const receiver = getUser(receiverId)
      io.to(receiver?.socketId ?? "").emit("getMessage", { senderId, text })
      io.to(receiver?.socketId ?? "").emit("msgCount", {
        count: 1,
        senderId,
        chatId,
        text,
      })
    })
    socket.on("typing", ({ receiverId, isTyping, userId }) => {
      const user = getUser(receiverId)

      io.to(user?.socketId ?? "").emit("senderTyping", isTyping, userId)
    })


    socket.on("noti", (data, receiverId) => {
      const user = getUser(receiverId)
      io.to(user?.socketId ?? "").emit("notification", data)
      io.to(user?.socketId ?? "").emit("notificationCount", { count: 1 })
    })
    // when disconnection
    socket.on("disconnect", () => {
      removeUser(socket.id)
      io.emit("getUsers", users)
    })
  })
}

export default socketConfig
