import configKeys from "../../../../config";
import { HttpStatus } from "../../../../types/httpStatus";
import AppError from "../../../../utils/appError";
import { AuthServiceInterface } from "../../../service-interface/authServices";

export const loginAdmin = async (
  email: string,
  password: string,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (
    email === configKeys.ADMIN_EMAIL &&
    password === configKeys.ADMIN_PASSWORD
  ) {
    const accessToken = authService.createTokens(email, "Admin_User", "admin");
    return accessToken;
  }
  throw new AppError("invalid credentials", HttpStatus.UNAUTHORIZED);
};
