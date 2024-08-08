import { Application } from "express"
import authRouter from "./user/auth"
import ownerRouter from "./owner"
import adminRouter from "./admin"

const routes = (app: Application) => {
  app.use("/api/user", authRouter())
  app.use("/api/owners", ownerRouter())
  app.use("/api/admin", adminRouter())
}
export default routes
