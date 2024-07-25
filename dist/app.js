"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const server_1 = __importDefault(require("./frameworks/webserver/server"));
const routes_1 = __importDefault(require("./frameworks/webserver/routes"));
const connection_1 = __importDefault(require("./frameworks/database/connection"));
const expressConfig_1 = __importDefault(require("./frameworks/webserver/expressConfig"));
const errorhandlerMiddleware_1 = __importDefault(require("./frameworks/webserver/middlewares/errorhandlerMiddleware"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./frameworks/webSocket/socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(0, socket_1.default)(io);
(0, expressConfig_1.default)(app);
(0, connection_1.default)();
(0, routes_1.default)(app);
app.use(errorhandlerMiddleware_1.default);
// app.all("*",(req:Request,res:Response,next:NextFunction)=>{
//     next(new AppError(`Not found:${req.url}`,404))
// })
(0, server_1.default)(server).startServer();
