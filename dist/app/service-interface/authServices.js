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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceInterface = void 0;
const authServiceInterface = (service) => {
    const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () { return service.encryptedPassword(password); });
    const comparePassword = (inputPassword, password) => __awaiter(void 0, void 0, void 0, function* () { return service.comparePassword(inputPassword, password); });
    const generateOtp = () => service.generateOtp();
    const createTokens = (id, name, role) => service.createTokens(id, name, role);
    const getRandomString = () => service.getRandomString();
    return {
        encryptPassword,
        comparePassword,
        generateOtp,
        createTokens,
        getRandomString,
    };
};
exports.authServiceInterface = authServiceInterface;
