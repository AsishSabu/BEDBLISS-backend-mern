import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces"
import { AuthServiceInterface } from "../../app/service-interface/authServices"
import { getUserProfile } from "../../app/use-cases/User/read&write/profile"
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB"
import { GoogleAndFacebookResponseType } from "../../types/GoogleandFacebookResponseTypes"
import { HttpStatus } from "../../types/httpStatus"
import { CreateUserInterface, UserInterface } from "../../types/userInterfaces"

import {
  authenticateGoogleandFacebookUser,
  deleteOtp,
  loginUser,
  sendResetVerificationCode,
  userRegister,
  verifyOtpUser,
  verifyTokenResetPassword,
} from "../../app/use-cases/User/auth/userAuth"
import { AuthServiceType } from "../../frameworks/services/authservice"

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType,
  userDbRepository: userDbInterfaceType,
  userDbRepositoryImpl: userDbRepositoryType
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl())
  const authService = authServiceInterface(authServiceImpl())

  const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user: CreateUserInterface = req.body;
        const newUser = await userRegister(user, dbRepositoryUser, authService);
        res.json({
          status: "success",
          message: "otp is sended to the email",
          newUser,
        });
      } catch (error) {
        next(error);
      }
    }
  );



  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, userid } = req.body
      const isVerified = await verifyOtpUser(otp, userid, dbRepositoryUser)
      if (isVerified) {
        return res
          .status(HttpStatus.OK)
          .json({ message: "user acoount is verified, please login" })
      }
    } catch (error) {
      next(error)
    }
  }

  const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body
      await deleteOtp(userId, dbRepositoryUser, authService)
      res.json({ message: "New otp sent to mail" })
    } catch (error) {
      next(error)
    }
  }

  const userLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { accessToken, isEmailExist } = await loginUser(
          req.body,
          dbRepositoryUser,
          authService
        );
        res.json({
          status: "success",
          message: "user logined",
          accessToken,
          user: isEmailExist,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  const GoogleAndFacebbokSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: GoogleAndFacebookResponseType = req.body;    
      console.log(req.body,"google auth");
       
      const { accessToken, isEmailExist, newUser } =
        await authenticateGoogleandFacebookUser(
          userData,
          dbRepositoryUser,
          authService
        );
        console.log(accessToken,isEmailExist,newUser,"..........");
        
      const user = isEmailExist ? isEmailExist : newUser;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success", user, accessToken });
    } catch (error) {
      next(error);
    }
  };


  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body
      await sendResetVerificationCode(email, dbRepositoryUser, authService)
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password code sent to your mail",
      })
    } catch (error) {
      next(error)
    }
  }

  const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body
      const { token } = req.params
      await verifyTokenResetPassword(
        token,
        password,
        dbRepositoryUser,
        authService
      )
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password success,you can login with your new password",
      })
    } catch (error) {
      next(error)
    }
  }


  return {
    registerUser,
    userLogin,
    verifyOtp,
    GoogleAndFacebbokSignIn,
    forgotPassword,
    resetPassword,
    resendOtp,
   
  }
}

export default authController
