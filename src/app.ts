import express, { Application, Request, Response, NextFunction } from "express"
import http from "http"
import serverConfig from "./frameworks/webserver/server"
import connectDb from "./frameworks/database/connection"
import expressConfig from "./frameworks/webserver/expressConfig"
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorhandlerMiddleware"
import AppError from "./utils/appError"
import { Server } from "socket.io"
import socketConfig from "./frameworks/webSocket/socket"
import path from "path"
import routes from "./frameworks/webserver/routes"

const app: Application = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
})
app.use(express.static(path.join(__dirname, "/frontend/dist")))

socketConfig(io)

expressConfig(app)

connectDb()

routes(app)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"))
})



app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Not found:${req.url}`, 404))
})

app.use(errorHandlingMiddleware)

serverConfig(server).startServer()
