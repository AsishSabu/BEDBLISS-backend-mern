import {Router} from "express";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { authService } from "../../../services/authService";
import adminController from '../../../../adapters/adminController/adminController';
const adminRouter=()=>{
    const router=Router();
    const controller=adminController(
        authServiceInterface,
        authService
    )
    router.post('/login',controller.adminLogin)
    return router
}
export default adminRouter