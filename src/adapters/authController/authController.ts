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
  authenticateGoogleandFacebookUser
} from "../../app/use-cases/User/auth/userAuth";
import { HttpStatus } from "../../types/httpStatus";
import { GoogleAndFacebookResponseType } from "../../types/GoogleandFacebookResponseTypes";

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
       
        const {accessToken,isEmailExist} = await loginUser(
          req.body,
          dbRepositoryUser,
          authService
        );
        res.json({status:"success",message:"user logined",accessToken,user:isEmailExist})
        
      } catch (error) {
        next(error);
      }
    }
  );

  const GoogleAndFacebbokSignIn=async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const userData:GoogleAndFacebookResponseType=req.body
      const {accessToken,isEmailExist,newUser}=await authenticateGoogleandFacebookUser(
        userData,
        dbRepositoryUser,
        authService
      );
      const user=isEmailExist?isEmailExist:newUser;
      res.status(HttpStatus.OK)
      .json({message:"login success",user,accessToken})
      
    } catch (error) {
      next(error)
    }
  }
  
  return {
    registerUser,
    userLogin,
    verifyOtp,
    GoogleAndFacebbokSignIn
  };
};

export default authController;
