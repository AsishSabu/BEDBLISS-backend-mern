import { Application} from "express";
import ownerRouter from "./owner";
import adminRouter from "./admin";
import authRouter from "./user/auth";
const routes = (app: Application) => {
    app.use("/api/user",authRouter())
    // app.use("/api/owners",ownerRouter())
    app.use("/api/admin",adminRouter())
    
};
export default routes;
