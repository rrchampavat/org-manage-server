import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { CustomRequest } from "../utils/interfaces";

export const VerifySameUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const requestUserID = req.id;

    if (!token) throw new Error("Token is missing!");

    const decodedToken = jwt.verify(
      token,
      process.env.SUPER_ADMIN_SECRET_KEY!
    ) as JwtPayload;

    if (decodedToken.id !== requestUserID) {
      return res.status(403).json({ "message": "Forbidden request!" });
    }

    return next();
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};
