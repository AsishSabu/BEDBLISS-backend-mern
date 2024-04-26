import { loginOwner } from './../../../../app/use-cases/Owner/auth/ownerAuth';
import express from "express";
import authController from "../../../../adapters/owner/authController";
import { authServiceInterface} from "../../../../app/service-interface/authServices";
import { authService} from "../../../services/authservice";
import { ownerRepositoryMongoDb } from "../../../database/repositories/ownerRepository";
import { ownerDbRepository } from "../../../../app/interfaces/ownerDbinterface";
const ownerRouter = () => {
    const router=express.Router();
    const controller=authController(
        authServiceInterface,
        authService,
        ownerDbRepository,
        ownerRepositoryMongoDb
    )
    router.post("/auth/register",controller.registerUser);
    router.post("/auth/login",controller.ownerLogin)
    router.post("/auth/verifyOtp",controller.verifyOtp)
    router.post("/auth/googleSignIn",controller.GoogleAndFacebbokSignIn)
    router.post("/auth/facebookSignIn",controller.GoogleAndFacebbokSignIn)
    return router
};
export default ownerRouter;
