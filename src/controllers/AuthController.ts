import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import Database from "../db/dbConnection";
import { ISuperAdmin } from "../models/interfaces";
import { superAdminTokenMaxAge } from "../utils/constant";
import sendEmail from "../utils/sendEmail";
import { sAdminTableKeys, superAdminTableName } from "../db/utils";

export default class AuthController {
  public async superAdminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const connection = Database.init();

      const promiseConnection = connection.promise();

      const sql = `SELECT * FROM ${superAdminTableName} WHERE ${sAdminTableKeys.email} =?`;

      const [rows]: [rows: ISuperAdmin[]] = await promiseConnection.query(
        sql,
        email
      );

      if (!rows.length) {
        return res.status(404).json({ "message": "User not found!" });
      }

      const user = rows[0];

      if (!user?.sadmin_is_active) {
        return res.status(403).json({ "message": "User is not active!" });
      }

      const match = await bcrypt.compare(password, user?.sadmin_password);

      if (!match) {
        return res
          .status(403)
          .json({ "message": "Email or password is incorrect !" });
      }

      const token = jwt.sign(
        { "id": user?.sadmin_id },
        process.env.SUPER_ADMIN_SECRET_KEY!,
        { expiresIn: superAdminTokenMaxAge }
      );

      return (
        res
          // .cookie("jwt", token, {
          //   httpOnly: true,
          //   sameSite: "none",
          //   secure: false,
          //   maxAge: superAdminTokenMaxAge * 1000, // in miliseconds
          // })
          .status(200)
          .json({
            "message": "Logged in successfully!",
            "token": token,
          })
      );
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }

  public async superAdminRegister(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const connection = Database.init();

      const promiseConnection = connection.promise();

      const getSQL = `SELECT * FROM ${superAdminTableName} WHERE ${sAdminTableKeys.email} =?`;
      const getValues = [email];

      const [getRows]: [getRows: ISuperAdmin[]] = await promiseConnection.query(
        getSQL,
        getValues
      );

      if (getRows.length) {
        return res.status(400).json({ "message": "Email is already in use!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSQL = `INSERT INTO ${superAdminTableName} (${sAdminTableKeys.name}, ${sAdminTableKeys.email}, ${sAdminTableKeys.password}) VALUES (?,?,?)`;
      const insertValues = [name, email, hashedPassword];

      await promiseConnection.query(insertSQL, insertValues);

      // const emailContent = {
      //   receiverEmails: [email],
      //   receiverName: name,
      //   subject: "Welcome to Organisations Management!",
      //   text: `Hey ${name}, Thanks for joining with us as a SUPER ADMIN!`,
      // };

      // sendEmail(emailContent);

      return res.status(201).json({
        "message": "Admin registered succesfully!",
      });
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }

  public logout(_req: Request, res: Response) {
    try {
      res.clearCookie("jwt");

      return res.status(200).json({ "messasge": "Logged out successfully!" });
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }
}
