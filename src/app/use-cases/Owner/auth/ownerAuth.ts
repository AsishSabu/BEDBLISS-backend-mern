import { GoogleAndFacebookResponseType } from "../../../../types/GoogleandFacebookResponseTypes";
import {
  CreateOwnerInterface,
  OwnerInterface,
} from "../../../../types/OwnerInterfaces";
import { HttpStatus } from "../../../../types/httpStatus";
import AppError from "../../../../utils/appError";
import sendMail from "../../../../utils/sendMail";
import { otpEmail } from "../../../../utils/userEmail";
import { ownerDbInterfaceType } from "../../../interfaces/ownerDbInterface";
import { AuthServiceInterface } from "../../../service-interface/authServices";
import createOwnerEntity, {
  GoogleandFaceebookSignInUserEntity,
  GoogleandFaceebookUserEntityType,
  UserEntityType,
} from "./../../../../entites/user";

export const ownerRegister = async (
  owner: CreateOwnerInterface,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, password, phoneNumber } = owner;
  const existingEmailUser = await ownerRepository.getOwnerByEmail(email);
  if (existingEmailUser) {
    throw new AppError(
      "this email is already register with an account",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hashedPassword: string = await authService.encryptPassword(password);

  const userEntity: UserEntityType = createOwnerEntity(
    name,
    email,
    phoneNumber,
    hashedPassword
  );

  // create a new user
  const newUser: OwnerInterface = await ownerRepository.addOwner(userEntity);

  const OTP = authService.generateOtp();

  console.log(OTP);

  //adding otp to database
  await ownerRepository.addOtp(OTP, newUser.id);
  const emailSubject = "Account verification";
  sendMail(newUser.email, emailSubject, otpEmail(OTP, newUser.name));

  return newUser;
};

export const loginOwner = async (
  user: { email: string; password: string },
  userRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { email, password } = user;
  const isEmailExist = await userRepository.getOwnerByEmail(email);

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

export const deleteOtp = async (
  OwnerId: string,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const newOtp: string = authService.generateOtp();
  const deleted = await ownerRepository.deleteOtpWithOwner(OwnerId);
  if (deleted) {
    await ownerRepository.addOtp(newOtp, OwnerId);
  }
  const Owner = await ownerRepository.getOwnerById(OwnerId);
  if (Owner !== null) {
    const owner = Owner as OwnerInterface;
    if (owner) {
      const emailSubject = "Account verification ,New Otp";
      sendMail(owner.email, emailSubject, otpEmail(newOtp, owner.name));
    }
  }
  console.log(newOtp);
};

export const verifyOtpOwner = async (
  otp: string,
  userId: string,
  userRepository: ReturnType<ownerDbInterfaceType>
) => {
  console.log(otp);

  if (!otp) {
    throw new AppError("please provide an OTP", HttpStatus.BAD_REQUEST);
  }
  const otpUser = await userRepository.findOtpWithOwner(userId);
  if (!otpUser) {
    throw new AppError("Invlaid OTP ", HttpStatus.BAD_REQUEST);
  }
  if (otpUser.otp === otp) {
    await userRepository.updateOwnerverification(userId);
    return true;
  } else {
    throw new AppError("Invalid OTP,try again", HttpStatus.BAD_REQUEST);
  }
};
export const authenticateGoogleandFacebookOwner = async (
  ownerData: GoogleAndFacebookResponseType,
  ownerRepository: ReturnType<ownerDbInterfaceType>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const { name, email, picture, email_verified } = ownerData;
  const isEmailExist = await ownerRepository.getOwnerByEmail(email);
  if (isEmailExist?.isBlocked) {
    throw new AppError(
      "Your account is blocked by administrator",
      HttpStatus.FORBIDDEN
    );
  }
  if (isEmailExist) {
    const accessToken = authService.createTokens(
      isEmailExist.id,
      isEmailExist.name,
      isEmailExist.role
    );
    return { isEmailExist, accessToken };
  } else {
    const googleFacebookOwner: GoogleandFaceebookUserEntityType =
      GoogleandFaceebookSignInUserEntity(name, email, picture, email_verified);
    const newOwner = await ownerRepository.registerGooglefacebookoOwner(
      googleFacebookOwner
    );
    const ownerId = newOwner._id as unknown as string;
    const Name = newOwner.name as unknown as string;
    const accessToken = authService.createTokens(ownerId, Name, newOwner.role);
    return { accessToken, newOwner };
  }
};
