import createUserEntity, {
  GoogleandFaceebookSignInUserEntity,
  GoogleandFaceebookUserEntityType,
  UserEntityType,
} from "../../../../entites/user"
import { GoogleAndFacebookResponseType } from "../../../../types/GoogleandFacebookResponseTypes"
import { HttpStatus } from "../../../../types/httpStatus"
import {
  CreateUserInterface,
  UserInterface,
} from "../../../../types/userInterfaces"
import AppError from "../../../../utils/appError"
import sendMail from "../../../../utils/sendMail"
import { forgotPasswordEmail, otpEmail } from "../../../../utils/userEmail"
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces"
import { AuthServiceInterface } from "../../../service-interface/authServices"
export const userRegister = async (
  user: CreateUserInterface,
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, password,role } = user;
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
    hashedPassword,
    role
  );

  // create a new user
  const newUser: UserInterface = await userRepository.addUser(userEntity);

  const OTP = authService.generateOtp();

  //adding otp to database
  await userRepository.addOtp(OTP, newUser.id);
  const emailSubject = "Account verification";  
  sendMail(newUser.email, emailSubject, otpEmail(OTP, newUser.name));

  return newUser;
};


//user login

export const loginUser = async (
  user: { email: string; password: string },
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { email, password } = user;
  const isEmailExist = await userRepository.getUserByEmail(email);

  if (!isEmailExist) {
    throw new AppError("Invalid Credantials", HttpStatus.UNAUTHORIZED);
  }
  if (isEmailExist.isBlocked) {
    throw new AppError("Account is Blocked", HttpStatus.FORBIDDEN);
  }
  if (!isEmailExist.isVerified) {
    throw new AppError("Account is not verified", HttpStatus.UNAUTHORIZED);
  }
  if (!isEmailExist.password) {
    throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
  }

  const isPasswordMatched = await authService.comparePassword(
    password,
    isEmailExist?.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Invalid Credentials", HttpStatus.UNAUTHORIZED);
  }

  const accessToken = authService.createTokens(
    isEmailExist.id,
    isEmailExist.name,
    isEmailExist.role
  );

  return { accessToken, isEmailExist };
};


export const verifyOtpUser = async (
  otp: string,
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  if (!otp) {
    throw new AppError("please provide an OTP", HttpStatus.BAD_REQUEST)
  }
  const otpUser = await userRepository.findOtpWithUser(userId)
  if (!otpUser) {
    throw new AppError("Invlaid OTP ", HttpStatus.BAD_REQUEST)
  }
  if (otpUser.otp === otp) {
    const wallet = await userRepository.addWallet(userId)
    await userRepository.updateProfile(userId, {
      isVerified: true,
      wallet: wallet._id,
    });
    return true;
  } else {
    throw new AppError("Invalid OTP,try again", HttpStatus.BAD_REQUEST)
  }
}

export const authenticateGoogleandFacebookUser = async (
  userData: GoogleAndFacebookResponseType,
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, picture, email_verified,role } = userData;
  const isEmailExist = await userRepository.getUserByEmail(email);
  if (isEmailExist?.isBlocked) {
    throw new AppError("Your account is blocked by administrator",HttpStatus.FORBIDDEN);
  }
  if(isEmailExist&&role!==isEmailExist?.role){
    throw new AppError(`you already register as ${isEmailExist?.role}`, HttpStatus.FORBIDDEN);
  }
  if (isEmailExist) {
    const accessToken = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
    );
    return { isEmailExist, accessToken };
  } else {
    const googleFacebookUser: GoogleandFaceebookUserEntityType =
      GoogleandFaceebookSignInUserEntity(name, email, picture, email_verified,role);
    const newUser = await userRepository.registerGooglefacebookoUser(
      googleFacebookUser
    );
    const userId = newUser._id as unknown as string;
    const Name = newUser.name as unknown as string;
    const accessToken = authService.createTokens(userId, Name, role);
    return { accessToken, newUser };
  }
};

export const sendResetVerificationCode = async (
  email: string,
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isEmailExist = await userRepository.getUserByEmail(email)

  if (!isEmailExist)
    throw new AppError(`${email} does not exist`, HttpStatus.UNAUTHORIZED)

  const verificationCode = authService.getRandomString()

  const isUpdated = await userRepository.updateVerificationCode(
    email,
    verificationCode
  )
  sendMail(
    email,
    "Reset password",
    forgotPasswordEmail(isEmailExist.name, verificationCode)
  )
}

export const verifyTokenResetPassword = async (
  verificationCode: string,
  password: string,
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!verificationCode)
    throw new AppError(
      "Please provide a verification code",
      HttpStatus.BAD_REQUEST
    )
  const hashedPassword = await authService.encryptPassword(password)
  const isPasswordUpdated = await userRepository.verifyAndResetPassword(
    verificationCode,
    hashedPassword
  )
  if (!isPasswordUpdated) {
    throw new AppError("Invalid token or token expired", HttpStatus.BAD_REQUEST)
  }
}

export const deleteOtp = async (
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const newOtp: string = authService.generateOtp()
  const deleted = await userRepository.deleteOtpWithUser(userId)
  if (deleted) {
    await userRepository.addOtp(newOtp, userId)
  }
  const user:any = await userRepository.getUserById(userId)
  const emailSubject = "Account verification ,New Otp"
  sendMail(user.email, emailSubject, otpEmail(newOtp, user.name))
}

