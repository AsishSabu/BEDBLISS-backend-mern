"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = require("../../../types/httpStatus");
const config_1 = __importDefault(require("../../../config"));
function authenticateUser(req, res, next) {
    console.log("in middleware");
    const access_token = req.headers.authorization;
    console.log("token----", access_token);
    if (!access_token) {
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("Your are not authenticated");
    }
    const tokenParts = access_token.split(" ");
    const token = tokenParts.length === 2 ? tokenParts[1] : null;
    if (!token) {
        console.log("not token");
        return res.status(httpStatus_1.HttpStatus.FORBIDDEN).json("Invalid access token format");
    }
    jsonwebtoken_1.default.verify(token, config_1.default.ACCESS_SECRET, (err, user) => {
        if (err) {
            res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
        else if (user.isBlocked) {
            console.log("user is blocked");
            res
                .status(httpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "user is Blocked" });
        }
        else {
            console.log("no problem in middleware");
            req.user = user.id;
            console.log(req.user, ".................................");
            next();
        }
    });
}
exports.default = authenticateUser;
