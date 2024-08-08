"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOtp = exports.verifyTokenResetPassword = exports.sendResetVerificationCode = exports.authenticateGoogleandFacebookUser = exports.verifyOtpUser = exports.loginUser = exports.userRegister = void 0;
const user_1 = __importStar(require("../../../../entites/user"));
const httpStatus_1 = require("../../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../../utils/appError"));
const sendMail_1 = __importDefault(require("../../../../utils/sendMail"));
const userEmail_1 = require("../../../../utils/userEmail");
const userRegister = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = user;
    const existingEmailUser = yield userRepository.getUserByEmail(email);
    if (existingEmailUser) {
        throw new appError_1.default("this email is already register with an account", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const hashedPassword = yield authService.encryptPassword(password);
    const userEntity = (0, user_1.default)(name, email, hashedPassword, role);
    // create a new user
    const newUser = yield userRepository.addUser(userEntity);
    const OTP = authService.generateOtp();
    //adding otp to database
    yield userRepository.addOtp(OTP, newUser.id);
    const emailSubject = "Account verification";
    console.log(OTP, "---OTP");
    (0, sendMail_1.default)(newUser.email, emailSubject, (0, userEmail_1.otpEmail)(OTP, newUser.name));
    return newUser;
});
exports.userRegister = userRegister;
//user login
const loginUser = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if (!isEmailExist) {
        throw new appError_1.default("Invalid Credantials", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (isEmailExist.isBlocked) {
        throw new appError_1.default("Account is Blocked", httpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (!isEmailExist.isVerified) {
        throw new appError_1.default("Account is not verified", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (!isEmailExist.password) {
        throw new appError_1.default("Invalid credentials", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const isPasswordMatched = yield authService.comparePassword(password, isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.password);
    if (!isPasswordMatched) {
        throw new appError_1.default("Invalid Credentials", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const accessToken = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
    return { accessToken, isEmailExist };
});
exports.loginUser = loginUser;
const verifyOtpUser = (otp, userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otp) {
        throw new appError_1.default("please provide an OTP", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const otpUser = yield userRepository.findOtpWithUser(userId);
    if (!otpUser) {
        throw new appError_1.default("Invlaid OTP ", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (otpUser.otp === otp) {
        const wallet = yield userRepository.addWallet(userId);
        yield userRepository.updateProfile(userId, {
            isVerified: true,
            wallet: wallet._id,
        });
        return true;
    }
    else {
        throw new appError_1.default("Invalid OTP,try again", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyOtpUser = verifyOtpUser;
const authenticateGoogleandFacebookUser = (userData, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, picture, email_verified, role } = userData;
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.isBlocked) {
        throw new appError_1.default("Your account is blocked by administrator", httpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (isEmailExist && role !== (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.role)) {
        throw new appError_1.default(`you already register as ${isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.role}`, httpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (isEmailExist) {
        const accessToken = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
        return { isEmailExist, accessToken };
    }
    else {
        const googleFacebookUser = (0, user_1.GoogleandFaceebookSignInUserEntity)(name, email, picture, email_verified, role);
        const newUser = yield userRepository.registerGooglefacebookoUser(googleFacebookUser);
        const userId = newUser._id;
        const Name = newUser.name;
        const accessToken = authService.createTokens(userId, Name, role);
        return { accessToken, newUser };
    }
});
exports.authenticateGoogleandFacebookUser = authenticateGoogleandFacebookUser;
const sendResetVerificationCode = (email, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield userRepository.getUserByEmail(email);
    if (!isEmailExist)
        throw new appError_1.default(`${email} does not exist`, httpStatus_1.HttpStatus.UNAUTHORIZED);
    const verificationCode = authService.getRandomString();
    const isUpdated = yield userRepository.updateVerificationCode(email, verificationCode);
    (0, sendMail_1.default)(email, "Reset password", (0, userEmail_1.forgotPasswordEmail)(isEmailExist.name, verificationCode));
});
exports.sendResetVerificationCode = sendResetVerificationCode;
const verifyTokenResetPassword = (verificationCode, password, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verificationCode)
        throw new appError_1.default("Please provide a verification code", httpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const isPasswordUpdated = yield userRepository.verifyAndResetPassword(verificationCode, hashedPassword);
    if (!isPasswordUpdated) {
        throw new appError_1.default("Invalid token or token expired", httpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyTokenResetPassword = verifyTokenResetPassword;
const deleteOtp = (userId, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const newOtp = authService.generateOtp();
    const deleted = yield userRepository.deleteOtpWithUser(userId);
    if (deleted) {
        yield userRepository.addOtp(newOtp, userId);
    }
    const user = yield userRepository.getUserById(userId);
    const emailSubject = "Account verification ,New Otp";
    console.log(newOtp, "---OTP");
    (0, sendMail_1.default)(user.email, emailSubject, (0, userEmail_1.otpEmail)(newOtp, user.name));
});
exports.deleteOtp = deleteOtp;
