import createUserEntity, { UserEntityType } from "../../../../entites/user";
import { HttpStatus } from "../../../../types/httpStatus";
import {CreateUserInterface,UserInterface} from "../../../../types/userInterfaces";
import AppError from "../../../../utils/appError";
import { userDbInterface } from "../../../interfaces/userDbRepositories";
import { AuthServiceInterface } from "../../../service-interface/authServices";

export const userRegister = async (
  user: CreateUserInterface,
  userRepository: ReturnType<userDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, password, phoneNumber } = user;
  const existingEmailUser = await userRepository.getUserByEmail(email);
  if (existingEmailUser) {
    throw new AppError(
      "this email is already register with an account",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hashedPassword: string = await authService.encryptPassword(password);

  const userEntity: UserEntityType = createUserEntity(
    name,
    email,
    phoneNumber,
    hashedPassword
  );

  // create a new user
  const newUser: UserInterface = await userRepository.addUser(userEntity);

  const OTP=authService.generateOtp();

  console.log(OTP);

  //adding otp to database
  await userRepository.addOtp(OTP,newUser.id)
  
  return newUser;
};

  //user login

  export const loginUser=async(
    user:{email:string;password:string},
    userRepository:ReturnType<userDbInterface>,
    authService:ReturnType<AuthServiceInterface>
  )=>{
    const {email,password}=user;
    const isEmailExist=await userRepository.getUserByEmail(email);

    if(!isEmailExist){
      throw new AppError("Invalid Credantials",HttpStatus.UNAUTHORIZED)
    }
    if(isEmailExist.isBlocked){
      throw new AppError("Account is Blocked",HttpStatus.FORBIDDEN)
    }
    if(!isEmailExist.isVerified){
      throw new AppError("Account is not verified",HttpStatus.UNAUTHORIZED)
    }
    if(!isEmailExist.password){
      throw new AppError("Invalid credentials",HttpStatus.UNAUTHORIZED)
    }

    const isPasswordMatched=await authService.comparePassword(password,isEmailExist?.password);
    
    
    if(!isPasswordMatched){
      throw new AppError("Invalid Credentials",HttpStatus.UNAUTHORIZED);
    }

    return {isEmailExist}
  }

  export const verifyOtpUser=async(
    otp:string,
    userId:string,
    userRepository:ReturnType<userDbInterface>
  )=>{
    if(!otp){
      throw new AppError("please provide an OTP",HttpStatus.BAD_REQUEST)
    }
    const otpUser=await userRepository.findOtpWithUser(userId);
    if(!otpUser){
      throw new AppError("Invlaid OTP ",HttpStatus.BAD_REQUEST);
    }
    if(otpUser.otp===otp){
      await userRepository.updateUserverification(userId)
      return true
    }else{
      throw new AppError("Invalid OTP,try again",HttpStatus.BAD_REQUEST);
      
    }
  }