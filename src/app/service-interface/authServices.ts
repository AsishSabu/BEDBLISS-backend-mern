import { AuthServiceReturn } from "../../frameworks/services/authservice";

export const authServiceInterface = (service: AuthServiceReturn) => {
  
  const encryptPassword =async(password: string) => service.encryptedPassword(password);

  const comparePassword=async(inputPassword:string,password:string)=>service.comparePassword(inputPassword,password);

  const generateOtp=()=>service.generateOtp()

  return {
    encryptPassword,
    comparePassword,
    generateOtp
  };
};
export type AuthServiceInterface = typeof authServiceInterface;
