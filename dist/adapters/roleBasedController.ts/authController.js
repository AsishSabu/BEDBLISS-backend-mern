"use strict";
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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const httpStatus_1 = require("../../types/httpStatus");
const userAuth_1 = require("../../app/use-cases/User/auth/userAuth");
const authController = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.body;
            const newUser = yield (0, userAuth_1.userRegister)(user, dbRepositoryUser, authService);
            res.json({
                status: "success",
                message: "otp is sended to the email",
                newUser,
            });
        }
        catch (error) {
            next(error);
        }
    }));
    const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp, userid } = req.body;
            const isVerified = yield (0, userAuth_1.verifyOtpUser)(otp, userid, dbRepositoryUser);
            if (isVerified) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ message: "user acoount is verified, please login" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            yield (0, userAuth_1.deleteOtp)(userId, dbRepositoryUser, authService);
            res.json({ message: "New otp sent to mail" });
        }
        catch (error) {
            next(error);
        }
    });
    const userLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, isEmailExist } = yield (0, userAuth_1.loginUser)(req.body, dbRepositoryUser, authService);
            res.json({
                status: "success",
                message: "user logined",
                accessToken,
                user: isEmailExist,
            });
        }
        catch (error) {
            next(error);
        }
    }));
    const GoogleAndFacebbokSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = req.body;
            console.log(req.body, "google auth");
            const { accessToken, isEmailExist, newUser } = yield (0, userAuth_1.authenticateGoogleandFacebookUser)(userData, dbRepositoryUser, authService);
            console.log(accessToken, isEmailExist, newUser, "..........");
            const user = isEmailExist ? isEmailExist : newUser;
            res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ message: "login success", user, accessToken });
        }
        catch (error) {
            next(error);
        }
    });
    const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            yield (0, userAuth_1.sendResetVerificationCode)(email, dbRepositoryUser, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password code sent to your mail",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { token } = req.params;
            yield (0, userAuth_1.verifyTokenResetPassword)(token, password, dbRepositoryUser, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password success,you can login with your new password",
            });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        registerUser,
        userLogin,
        verifyOtp,
        GoogleAndFacebbokSignIn,
        forgotPassword,
        resetPassword,
        resendOtp,
    };
};
exports.default = authController;
