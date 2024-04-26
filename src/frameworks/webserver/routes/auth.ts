import express from "express";
import authController from "../../../adapters/authController/authController";
import { authServiceInterface } from "../../../app/service-interface/authServices";
import { authService } from "../../services/authservice";
import { userDbRepository } from "../../../app/interfaces/userDbRepositories";
import { userRepositoryMongoDb } from "../../database/repositories/userRepostoryMongoDB";

const authRouter = () => {
  const router = express.Router();
  const controller = authController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDb
  );
  router.post("/auth/register", controller.registerUser);

  router.post("/auth/login",controller.userLogin);

  router.post("/auth/verifyOtp",controller.verifyOtp)

  router.post("/auth/googleSignIn",controller.GoogleAndFacebbokSignIn);

  router.post("/auth/facebookSignIn",controller.GoogleAndFacebbokSignIn)
 

  return router;
};
export default authRouter;
