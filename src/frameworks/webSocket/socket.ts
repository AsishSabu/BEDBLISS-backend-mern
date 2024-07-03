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
   console.log(users,"this is user array")
    return users.find(user => user.userId === userId)
  }

  io.on("connection", socket => {
    // when connection established
    console.log(`user connected with id ${socket.id} 😃`)
    io.emit("welcome", "hello this is socket server")

    socket.on("addUser", userId => {
      // take userid and socketId from user
      addUsers(userId, socket.id)
      io.emit("getUsers", users)
    })
  // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
      const receiver=getUser(receiverId)
      io.to(receiver?.socketId ?? "").emit("getMessage", { senderId, text })
      io.to(receiver?.socketId ?? "").emit("notification", {
        count: 1,
        senderId,
        chatId,
        text,
      });
    })
    socket.on("typing", ({  receiverId, isTyping,userId }) => {
      console.log(receiverId,"iddddd 😀");
      const user = getUser( receiverId);
      console.log(isTyping,"is typingggggg 😀");
      
      io.to(user?.socketId ?? "").emit("senderTyping", isTyping,userId);
    });
    
    socket.on("noti", ({  bookingId,userId,status }) => {
      console.log(userId,"iddddd 😀");
      const user = getUser( userId);
      console.log(status,"///////////");
      console.log(bookingId,"/////////");
      
      
  
      
      io.to(user?.socketId ?? "").emit("senderTyping",userId);
    });
    // when disconnection
    socket.on("disconnect", () => {
      removeUser(socket.id)
      console.log("A user has been disconnected 😒")
      io.emit("getUsers", users)
    })
  })
}

export default socketConfig;
