import { Response } from "express";

import Database from "../db/dbConnection";
import { CustomRequest } from "../utils/interfaces";
import { ISuperAdmin } from "../models/interfaces";

export default class SAdminController {
  public getSuperAdmin(req: CustomRequest, res: Response) {
    try {
      const sAdminID = req.id;

      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        "SELECT * FROM super_admins WHERE sadmin_id",
        sAdminID,
        (queryErr, queryRes) => {
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

          const super_admin = {
            "name": user.sadmin_name,
            "email": user.sadmin_email,
          };

          return res.status(200).json({
            "message": "Super admin fetched successfully!",
            "data": super_admin,
          });
        }
      );
    } catch (error: any) {
      res.status(Number(error.code) || 500).json({ "message": error.message });
    }
  }
}
