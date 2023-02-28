import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import { ISuperAdmin } from "../models/interfaces";

interface DecodedToken extends JwtPayload {
  "id": number;
  "iat": number;
}

export const VerifySuperAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) throw new Error("Token is missing!");

    const decodedToken = jwt.verify(
      token,
      process.env.SUPER_ADMIN_SECRET_KEY!
    ) as DecodedToken;

    req.id = decodedToken.id;

    const connection = Database.init();

    connection.query<ISuperAdmin[]>(
      `SELECT * FROM super_admins WHERE sadmin_id =?`,
      decodedToken.id,
      async (queryErr, queryRes) => {
        if (queryErr) {
          return res
            .status(Number(queryErr.code) || 500)
            .json({ "message": queryErr.message });
        }

        if (!queryRes.length) {
          return res
            .status(400)
            .json({ "message": "Email or password is incorrect !" });
        }
      }
    );

    return next();
  } catch (error: any) {
    return res.status(401).send({ "message": error.message });
  }
};
