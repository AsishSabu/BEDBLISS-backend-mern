import { NextFunction, Request, Response } from "express";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { loginAdmin } from "../../app/use-cases/Admin/auth/adminAuth";
import { AuthServiceType } from "../../frameworks/services/authService";
import { HttpStatus } from "../../types/httpStatus";

const adminController = (
  authServiceInterface: AuthServiceInterface,
  authServiceImpl: AuthServiceType
) => {
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

  return {
    adminLogin,
  };
};

export default adminController;
