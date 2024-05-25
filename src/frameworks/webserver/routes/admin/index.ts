import {Router} from "express";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { authService } from "../../../services/authService";
import adminController from '../../../../adapters/adminController/adminController';
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
const adminRouter=()=>{
    const router=Router();
    const controller=adminController(
        authServiceInterface,
        authService,
        userDbInterface,
        userDbRepository,
        hotelDbInterface,
         hotelDbRepository,


    )
    router.post('/login',controller.adminLogin);
    router.get("/users",controller.getAllUser);
    router.get("/counts",controller.CardCount);
    router.get("/owners",controller.getAllOwners)
    router.get("/hotels",controller.getAllHotels)
    router.patch("/block_user/:id",controller.userBlock);
    router.patch("/block_hotel/:id",controller.hotelBlock);
    return router
}
export default adminRouter