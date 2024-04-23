import { Application, Request, Response } from "express";
import authRouter from "./auth";
const routes = (app: Application) => {
    app.use("/api/user",authRouter())
};
export default routes;
