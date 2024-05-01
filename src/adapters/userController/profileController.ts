import { NextFunction, Request, Response } from "express";
import { AuthServiceInterface } from "../../app/service-interface/authServices";
import { AuthServiceType } from "../../frameworks/services/authService";
import { getUserProfile } from "../../app/use-cases/User/read&write/profile";
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces";
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB";

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
      const user = await getUserProfile(userId, dbRepositoryUser);
      console.log(user, "user profile");
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };
  return {
    userProfile,
  };
};
export default profileController;
