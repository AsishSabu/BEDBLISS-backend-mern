import express, { Application, Request, Response } from "express";
import http from "http";
import serverConfig from "./frameworks/webserver/server";
import routes from "./frameworks/webserver/routes";
import connectDb from "./frameworks/database/connection";
import expressConfig from "./frameworks/webserver/expressConfig";

const app: Application = express();

const server = http.createServer(app);

expressConfig(app)

connectDb();

routes(app);

serverConfig(server).startServer();
