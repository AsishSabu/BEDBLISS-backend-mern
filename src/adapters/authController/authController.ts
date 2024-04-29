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
  authenticateGoogleandFacebookUser,
  sendResetVerificationCode,
  verifyTokenResetPassword,
  deleteOtp,
} from "../../app/use-cases/User/auth/userAuth";
import { HttpStatus } from "../../types/httpStatus";
import { GoogleAndFacebookResponseType } from "../../types/GoogleandFacebookResponseTypes";
import { getUserProfile } from "../../app/use-cases/User/read&write/profile";

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
      message: "otp is sended to the email",
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

  const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      await deleteOtp(userId, dbRepositoryUser, authService);
      res.json({ message: "New otp sent to mail" });
    } catch (error) {
      next(error);
    }
  };

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
      const { accessToken, isEmailExist, newUser } =
        await authenticateGoogleandFacebookUser(
          userData,
          dbRepositoryUser,
          authService
        );
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
      const { email } = req.body;
      await sendResetVerificationCode(email, dbRepositoryUser, authService);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password code sent to your mail",
      });
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      console.log(token);
      console.log(password);

      await verifyTokenResetPassword(
        token,
        password,
        dbRepositoryUser,
        authService
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Reset password success,you can login with your new password",
      });
    } catch (error) {
      next(error);
    }
  };

  const userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body,"body............");
      const userId=req.body
      
      
      console.log(userId,'userid')
      const user  = await getUserProfile(
        userId,
        dbRepositoryUser
      );
      
      res.status(200).json({ success: true, user});
    } catch (error) {
      next(error)
    }
  };

  return {
    registerUser,
    userLogin,
    verifyOtp,
    GoogleAndFacebbokSignIn,
    forgotPassword,
    resetPassword,
    resendOtp,
    userProfile
  };
};

export default authController;
