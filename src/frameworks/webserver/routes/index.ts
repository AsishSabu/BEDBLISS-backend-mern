import { Application, Request, Response } from "express";
import authRouter from "./auth";
import ownerRouter from "./owner";
const routes = (app: Application) => {
    app.use("/api/user",authRouter())
    app.use("/api/owners",ownerRouter())
    
};
export default routes;
