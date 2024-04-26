import { authService } from './../../frameworks/services/authservice';
import asyncHandler from "express-async-handler";
import { HttpStatus } from "../../types/httpStatus";
import { ownerDbInterface } from "../../app/interfaces/ownerDbinterface";
import { ownerRepositoryMongoDb } from "../../frameworks/database/repositories/ownerRepository";
import { OwnerInterface } from "../../types/OwnerInterfaces";
import {Request,Response,NextFunction}from "express";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { AuthService } from "../../frameworks/services/authservice";
import { ownerRegister,loginOwner,verifyOtpOwner,authenticateGoogleandFacebookOwner} from "../../app/use-cases/Owner/auth/ownerAuth";
import { GoogleAndFacebookResponseType } from '../../types/GoogleandFacebookResponseTypes';

const authController=(
    authServiceInterface:AuthServiceInterface,
    authServiceImpl:AuthService,
    ownerDbRepository:ownerDbInterface,
    ownerDbRepositoryImpl:ownerRepositoryMongoDb
)=>{
    const dbRepositoryOwner=ownerDbRepository(ownerDbRepositoryImpl());
    const authService=authServiceInterface(authServiceImpl());

    const registerUser = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
    
        const user: OwnerInterface= req.body;
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
    
      const ownerLogin = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
          try {
           
            const {accessToken,isEmailExist} = await loginOwner(
              req.body,
              dbRepositoryOwner,
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
          const ownerData:GoogleAndFacebookResponseType=req.body
          const {accessToken,isEmailExist,newOwner}=await authenticateGoogleandFacebookOwner(
            ownerData,
            dbRepositoryOwner,
            authService
          );
          const owner=isEmailExist?isEmailExist:newOwner;
          res.status(HttpStatus.OK)
          .json({message:"login success",owner,accessToken})
          
        } catch (error) {
          next(error)
        }
      }

      return{
        registerUser,
        ownerLogin,
        verifyOtp,
        GoogleAndFacebbokSignIn
      }
    



}
export default authController