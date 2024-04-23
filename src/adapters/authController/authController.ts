import asyncHandler from "express-async-handler";
import { userRepositoryMongoDb } from "./../../frameworks/database/repositories/userRepostoryMongoDB";
import { userDbInterface } from "./../../app/interfaces/userDbRepositories";
import { Request, Response, NextFunction } from "express";
import { CreateUserInterface, UserInterface } from "../../types/userInterfaces";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { AuthService } from "../../frameworks/services/authservice";

import {
  userRegister,
  loginUser,
  verifyOtpUser,
} from "../../app/use-cases/User/auth/userAuth";
import { HttpStatus } from "../../types/httpStatus";

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthService,
  userDbRepository: userDbInterface,
  userDbRepositoryImpl: userRepositoryMongoDb
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);

    const user: UserInterface = req.body;
    const newUser = await userRegister(user, dbRepositoryUser, authService);
    res.json({
      status: "success",
      message: "user has been registerd successfully",
      newUser,
    });
  });

  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, userid } = req.body;
      const isVerified = await verifyOtpUser(otp, userid, dbRepositoryUser);
      if (isVerified) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "user acoount is verified, please login" });
      }
    } catch (error) {
      next(error);
    }
  };

  const userLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
       
        const {accessToken,userid} = await loginUser(
          req.body,
          dbRepositoryUser,
          authService
        );
        res.json({status:"success",message:"user verified",accessToken,userid})
        
      } catch (error) {
        next(error);
      }
    }
  );
  return {
    registerUser,
    userLogin,
    verifyOtp,
  };
};

export default authController;
