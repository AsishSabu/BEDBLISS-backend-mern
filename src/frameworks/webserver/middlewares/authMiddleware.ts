import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../types/httpStatus";
import configKeys from "../../../config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      doctor?: any;
    }
  }
}

export default function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {  
  const access_token = req.headers.authorization;
  if (!access_token) {
    return res.status(HttpStatus.FORBIDDEN).json("Your are not authenticated");
  }
  const tokenParts = access_token.split(" ");
  const token = tokenParts.length === 2 ? tokenParts[1] : null;

  if (!token) {
    return res.status(HttpStatus.FORBIDDEN).json("Invalid access token format");
  }
  jwt.verify(token, configKeys.ACCESS_SECRET, (err: any, user: any) => {
    if (err) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "Token is not valid" });
    } else {
      req.user = user.id;
      next();
    }
  });
}
