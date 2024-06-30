import { loginAdmin } from "./../../app/use-cases/Admin/auth/adminAuth"
import { NextFunction, Request, Response } from "express"
import { AuthServiceInterface } from "../../app/service-interface/authServices"
import { HttpStatus } from "../../types/httpStatus"
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces"
import { getUsers } from "../../app/use-cases/Admin/read&write/adminRead"
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB"
import { addStayType, blockHotel, blockUser, updateHotel, verifyHotel } from "../../app/use-cases/Admin/read&write/adminUpdate"
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"
import { getHotels } from "../../app/use-cases/Owner/hotel"
import { AuthServiceType } from "../../frameworks/services/authservice"

const adminController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType,
  userDbRepository: userDbInterfaceType,
  userDbRepositoryImpl: userDbRepositoryType,
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl())
  const authService = authServiceInterface(authServiceImpl())
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl())

  const adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body
      const accessToken = await loginAdmin(email, password, authService)
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Admin login success",
        admin: {
          name: "Admin_User",
          role: "admin",
        },
        accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  role='user'
      const { users } = await getUsers(role,dbRepositoryUser)
      return res.status(HttpStatus.OK).json({ success: true, users })
    } catch (error) {
      next(error)
    }
  }
  const getAllOwners = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  role='owner'
      const { users } = await getUsers(role,dbRepositoryUser)
      return res.status(HttpStatus.OK).json({ success: true, users })
    } catch (error) {
      next(error)
    }
  }

  const userBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await blockUser(id, dbRepositoryUser)
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "User blocked Successfully" })
    } catch (error) {
      next(error)
    }
  }


  const getAllHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { Hotels } = await getHotels(dbRepositoryHotel)
      return res.status(HttpStatus.OK).json({ success: true, Hotels })
    } catch (error) {
      next(error)
    }
  }

  const CardCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user="user"
      const owner='owner'
      const userCount = (await getUsers(user,dbRepositoryUser)).count
      const ownerCount = (await getUsers(owner,dbRepositoryUser)).count
      const hotelCount = (await getHotels(dbRepositoryHotel)).count
      console.log(ownerCount,"..........",userCount);
      
      return res
        .status(HttpStatus.OK)
        .json({ success: true, userCount,  hotelCount,ownerCount })
    } catch (error) {
      next(error)
    }
  }
  const hotelBlock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await blockHotel(id, dbRepositoryHotel)
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: " blocked Successfully" })
    } catch (error) {
      next(error)
    }
  }
  const hotelVerify= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await verifyHotel(id, dbRepositoryHotel)
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: " veified Successfully" })
    } catch (error) {
      next(error)
    }
  }
  const rejectHotel= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const {reason}=req.body
      
      
      const updates={
        isVerified:'rejected',
        Reason:reason
      }
      await updateHotel(id,updates,dbRepositoryHotel)
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: " Rejected Successfully" })
    } catch (error) {
      next(error)
    }
  }
  const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body; // Destructure name from req.body
      const result = await addStayType(name, dbRepositoryHotel);
      if (result) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Stay Type added Successfully" });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Failed to add Stay Type" });
      }
    } catch (error) {
      next(error);
    }
  };

  return {
    adminLogin,
    getAllUser,
    userBlock,
    getAllHotels,
    CardCount,
    hotelBlock,
    hotelVerify,
    rejectHotel,
    addCategory,
    getAllOwners
  }
}

export default adminController
