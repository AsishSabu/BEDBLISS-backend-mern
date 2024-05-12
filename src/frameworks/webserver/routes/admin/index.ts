import {Router} from "express";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { authService } from "../../../services/authService";
import adminController from '../../../../adapters/adminController/adminController';
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
const adminRouter=()=>{
    const router=Router();
    const controller=adminController(
        authServiceInterface,
        authService,
        userDbInterface,
        userDbRepository

    )
    router.post('/login',controller.adminLogin);
    router.get("/users",controller.getAllUser);
    router.get("/owners",controller.getAllOwners)
    router.patch("/block_user/:id",controller.userBlock);
    return router
}
export default adminRouter