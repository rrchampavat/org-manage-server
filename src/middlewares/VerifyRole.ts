import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import { ISuperAdmin } from "../models/interfaces";

const tableName = "super_admins";

export const isSuperAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")?.[1];

    if (!token) throw new Error("Token is missing!");

    const decodedToken = jwt.verify(
      token,
      process.env.SUPER_ADMIN_SECRET_KEY!
    ) as JwtPayload;

    const connection = Database.init();
    const promiseConnection = connection.promise();

    const sql = `SELECT * FROM ${tableName} WHERE sadmin_id =?`;
    const values = [decodedToken.id];

    const [rows]: [rows: ISuperAdmin[]] = await promiseConnection.query(
      sql,
      values
    );

    if (!rows?.length) {
      return res.status(403).json({ "message": "Forbidden request!" });
    }

    return next();
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};
