import { loginAdmin } from "./../../app/use-cases/Admin/auth/adminAuth";
import { NextFunction, Request, Response } from "express";
import { AuthServiceInterface } from "../../app/service-interface/authServices";

import { AuthServiceType } from "../../frameworks/services/authService";
import { HttpStatus } from "../../types/httpStatus";
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces";
import { getUsers} from "../../app/use-cases/Admin/read&write/adminRead";
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB";
import { blockUser } from "../../app/use-cases/Admin/read&write/adminUpdate";

const adminController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType,
  userDbRepository: userDbInterfaceType,
  userDbRepositoryImpl: userDbRepositoryType
) => {
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const accessToken = await loginAdmin(email, password, authService);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Admin login success",
        admin: {
          name: "Admin_User",
          role: "admin",
        },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await getUsers(dbRepositoryUser);
      return res.status(HttpStatus.OK).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  const userBlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await blockUser(id, dbRepositoryUser);
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "User blocked Successfully" });
    } catch (error) {
      next(error);
    }
  };
  return {
    adminLogin,
    getAllUser,
    userBlock
  };
};

export default adminController;
