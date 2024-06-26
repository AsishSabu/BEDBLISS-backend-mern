import { NextFunction, Request, Response } from "express";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { getUserProfile, updateUser,verifyNumber} from "../../app/use-cases/User/read&write/profile";
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces";
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB";
import { HttpStatus } from "../../types/httpStatus";
import { AuthServiceType } from "../../frameworks/services/authservice";
import { getTransaction } from "../../app/use-cases/Booking/booking";

const profileController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType,
  userDbRepository: userDbInterfaceType,
  userDbRepositoryImpl: userDbRepositoryType
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user;
      console.log(userId,'user id...........')
      const user = await getUserProfile(userId, dbRepositoryUser);
      console.log(user, "user profile");
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  const getUserById= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const user = await getUserProfile(userId, dbRepositoryUser);
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };
  const getUser=async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const userId=req.params.id;
      const updatedData=req.body;
      const user=await updateUser(userId,updatedData,dbRepositoryUser);
      res
      .status(200)
      .json({ success: true, user, message: "Profile updated successfully" });
      
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }

  const updateProfile=async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const userId=req.user;
      const updatedData=req.body;
      const user=await updateUser(userId,updatedData,dbRepositoryUser);
      res
      .status(200)
      .json({ success: true, user, message: "Profile updated successfully" });
      
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }
  const verifyPhoneNumber=async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    const {phone}=req.body;
    await verifyNumber(phone,dbRepositoryUser)
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "otp is sended to your phone number",
    });
    
  }

  const transactions=async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const userId=req.user;
      const transaction=await getTransaction(userId,dbRepositoryUser);
      res
      .status(200)
      .json({ success: true, transaction, message: "transactions" });
      
    } catch (error) {
      console.log(error);
      
      next(error)
    }
  }
  return {
    userProfile,
    getUserById,
    updateProfile,
    verifyPhoneNumber,
    getUser,
    transactions
  };
};
export default profileController;
