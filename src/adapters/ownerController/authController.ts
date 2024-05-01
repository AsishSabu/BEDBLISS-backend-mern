import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ownerDbInterfaceType } from "../../app/interfaces/ownerDbInterface";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import {
  authenticateGoogleandFacebookOwner,
  deleteOtp,
  loginOwner,
  ownerRegister,
  verifyOtpOwner,
} from "../../app/use-cases/Owner/auth/ownerAuth";
import { ownerDbRepositoryType } from "../../frameworks/database/repositories/ownerRepository";
import {
  AuthServiceType,
  authService,
} from "../../frameworks/services/authService";
import { GoogleAndFacebookResponseType } from "../../types/GoogleandFacebookResponseTypes";
import { OwnerInterface } from "../../types/OwnerInterfaces";
import { HttpStatus } from "../../types/httpStatus";

const authController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType,
  ownerDbRepository: ownerDbInterfaceType,
  ownerDbRepositoryImpl: ownerDbRepositoryType
) => {
  const dbRepositoryOwner = ownerDbRepository(ownerDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);

    const user: OwnerInterface = req.body;
    const newUser = await ownerRegister(user, dbRepositoryOwner, authService);
    res.json({
      status: "success",
      message: "user has been registerd successfully",
      newUser,
    });
  });
  const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, userid } = req.body;
      const isVerified = await verifyOtpOwner(otp, userid, dbRepositoryOwner);
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
      const { ownerId } = req.body;
      console.log(ownerId);

      await deleteOtp(ownerId, dbRepositoryOwner, authService);
      res.json({ message: "New otp sent to mail" });
    } catch (error) {
      next(error);
    }
  };

  const ownerLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { accessToken, isEmailExist } = await loginOwner(
          req.body,
          dbRepositoryOwner,
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
      const ownerData: GoogleAndFacebookResponseType = req.body;
      const { accessToken, isEmailExist, newOwner } =
        await authenticateGoogleandFacebookOwner(
          ownerData,
          dbRepositoryOwner,
          authService
        );
      const owner = isEmailExist ? isEmailExist : newOwner;
      res
        .status(HttpStatus.OK)
        .json({ message: "login success", owner, accessToken });
    } catch (error) {
      next(error);
    }
  };

  return {
    registerUser,
    ownerLogin,
    verifyOtp,
    GoogleAndFacebbokSignIn,
    resendOtp,
  };
};
export default authController;
