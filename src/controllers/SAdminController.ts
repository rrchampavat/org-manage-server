import { Response } from "express";

import Database from "../db/dbConnection";
import { CustomRequest } from "../utils/interfaces";
import { ISuperAdmin } from "../models/interfaces";

export default class SAdminController {
  public getSuperAdmin(req: CustomRequest, res: Response) {
    try {
      const sAdminID = req.id;
      const paramID = req.params.id;

      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        "SELECT * FROM super_admins WHERE sadmin_id =?",
        paramID ?? sAdminID,
        (queryErr, queryRes) => {
          if (queryErr) {
            return res
              .status(Number(queryErr.code) || 500)
              .json({ "message": queryErr.message });
          }

          if (!queryRes.length) {
            return res.status(400).json({ "message": "User does not exist !" });
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

  public getAllSuperAdmins(_req: CustomRequest, res: Response) {
    try {
      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        "SELECT * from super_admins",
        (queryErr, queryRes) => {
          if (queryErr) {
            return res
              .status(Number(queryErr.code) || 500)
              .json({ "message": queryErr.message });
          }

          const super_admins = queryRes?.map((sadmin: ISuperAdmin) => ({
            "id": sadmin.sadmin_id,
            "name": sadmin.sadmin_name,
            "email": sadmin.sadmin_email,
          }));

          return res.status(200).json({
            "message": "Super admins fetched successfully!",
            "data": super_admins,
          });
        }
      );
    } catch (error: any) {
      res.status(Number(error.code) || 500).json({ "message": error.message });
    }
  }

  public updateSuperAdmin(req: CustomRequest, res: Response) {
    try {
      const { name: updatedName } = req.body;
      const sAdminID = req.id;

      const connection = Database.init();

      connection.query<ISuperAdmin[]>(
        "SELECT * FROM super_admins WHERE sadmin_id =?",
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
              .json({ "message": "User does not exists !" });
          }

          connection.query<ISuperAdmin[]>(
            `UPDATE super_admins SET sadmin_name = '${updatedName}' WHERE sadmin_id = ${sAdminID}`,
            (queryErr) => {
              if (queryErr) {
                return res
                  .status(Number(queryErr.code) || 500)
                  .json({ "message": queryErr.message });
              }

              connection.query<ISuperAdmin[]>(
                "SELECT * FROM super_admins WHERE sadmin_id =?",
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
                      .json({ "message": "User does not exists !" });
                  }

                  const user = queryRes[0];

                  const super_admin = {
                    "name": user.sadmin_name,
                    "email": user.sadmin_email,
                  };

                  return res.status(200).json({
                    "message": "Super admin updated successfully!",
                    "data": super_admin,
                  });
                }
              );
            }
          );
        }
      );
    } catch (error: any) {
      res.status(Number(error.code)).json({ "message": error.message });
    }
  }
}
