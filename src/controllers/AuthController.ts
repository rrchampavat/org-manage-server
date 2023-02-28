import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import Database from "../db/dbConnection";
import { ISuperAdmin } from "../models/interfaces";

export default class AuthController {
  public superAdminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        `SELECT * FROM super_admins WHERE sadmin_email =?`,
        email,
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

          const user = queryRes[0];

          const match = await bcrypt.compare(password, user["sadmin_password"]);

          if (!match) {
            return res
              .status(403)
              .json({ "message": "Email or password is incorrect !" });
          }

          const token = jwt.sign(
            { "id": user?.sadmin_id },
            process.env.SUPER_ADMIN_SECRET_KEY as string
          );

          return res
            .cookie("jwt", token, {
              httpOnly: true,
              sameSite: "none",
              secure: false,
              maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
              "message": "Logged in !",
              "token": token,
            });
        }
      );
    } catch (error: any) {
      return res.status(Number(error.code)).json({ "message": error.message });
    }
  }

  public superAdminRegister(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!email || !name || !password) {
        return res
          .status(400)
          .json({ "message": "Please fill up all the required fields !" });
      }

      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        `SELECT * FROM super_admins WHERE sadmin_email =?`,
        email,
        async (queryErr, queryRes) => {
          if (queryErr) {
            return res
              .status(Number(queryErr.code))
              .json({ "message": queryErr.message });
          }

          if (queryRes.length) {
            return res
              .status(400)
              .json({ "message": "Email is already in use !" });
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          connection.query<ISuperAdmin[]>(
            `INSERT into super_admins (sadmin_name, sadmin_email, sadmin_password) VALUES (?,?,?)`,
            [name, email, hashedPassword],
            (queryErr) => {
              if (queryErr) {
                return res
                  .status(Number(queryErr.code) || 500)
                  .json({ "message": queryErr.message });
              }

              return res.status(200).json({
                "message": "Admin registered succesfully !",
              });
            }
          );
        }
      );
    } catch (error: any) {
      res.status(Number(error.code)).json({ "message": error.message });
    }
  }
}
