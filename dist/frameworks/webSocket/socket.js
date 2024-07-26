"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketConfig = (io) => {
    let users = [];
    function addUsers(userId, socketId) {
        const isUserPresent = users.some(user => user.userId === userId);
        if (!isUserPresent)
            return users.push({ userId, socketId });
    }
    function removeUser(socketId) {
        return (users = users.filter(user => user.socketId !== socketId));
    }
    function getUser(userId) {
        return users.find(user => user.userId === userId);
    }
    io.on("connection", socket => {
        // when connection established
        io.emit("welcome", "hello this is socket server");
        socket.on("addUser", userId => {
            // take userid and socketId from user
            addUsers(userId, socket.id);
            io.emit("getUsers", users);
        });
        // send and get message
        socket.on("sendMessage", ({ senderId, receiverId, text, chatId }) => {
            var _a, _b;
            const receiver = getUser(receiverId);
            io.to((_a = receiver === null || receiver === void 0 ? void 0 : receiver.socketId) !== null && _a !== void 0 ? _a : "").emit("getMessage", { senderId, text });
            io.to((_b = receiver === null || receiver === void 0 ? void 0 : receiver.socketId) !== null && _b !== void 0 ? _b : "").emit("msgCount", {
                count: 1,
                senderId,
                chatId,
                text,
            });
        });
        socket.on("typing", ({ receiverId, isTyping, userId }) => {
            var _a;
            const user = getUser(receiverId);
            io.to((_a = user === null || user === void 0 ? void 0 : user.socketId) !== null && _a !== void 0 ? _a : "").emit("senderTyping", isTyping, userId);
        });
        socket.on("noti", (data, receiverId) => {
            var _a, _b;
            const user = getUser(receiverId);
            io.to((_a = user === null || user === void 0 ? void 0 : user.socketId) !== null && _a !== void 0 ? _a : "").emit("notification", data);
            io.to((_b = user === null || user === void 0 ? void 0 : user.socketId) !== null && _b !== void 0 ? _b : "").emit("notificationCount", { count: 1 });
        });
        // when disconnection
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.emit("getUsers", users);
        });
    });
};
exports.default = socketConfig;
