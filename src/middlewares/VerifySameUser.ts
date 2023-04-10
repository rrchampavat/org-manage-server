import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { CustomRequest, DecodedToken } from "../utils/interfaces";

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
    ) as DecodedToken;

    if (decodedToken.id !== requestUserID) {
      return res.status(403).json({ "message": "Unauthorized request" });
    }

    return next();
  } catch (error: any) {
    return res.status(401).send({ "message": error.message });
  }
};
