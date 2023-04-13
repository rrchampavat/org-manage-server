import { Response } from "express";

import Database from "../db/dbConnection";
import { CustomRequest } from "../utils/interfaces";
import { ISuperAdmin } from "../models/interfaces";

const tableName = "super_admins";

export default class SAdminController {
  public async getSuperAdmin(req: CustomRequest, res: Response) {
    try {
      const sAdminID = req.id;
      const paramID = req.params.id;

      const connection = Database.init();

      const promiseConnection = connection.promise();

      const sql = `SELECT * FROM ${tableName} WHERE sadmin_id =?`;
      const values = [paramID ?? sAdminID];

      const [rows]: [rows: ISuperAdmin[]] = await promiseConnection.query(
        sql,
        values
      );

      if (!rows.length) {
        return res.status(400).json({ "message": "User does not exist!" });
      }

      const user = rows[0];

      const super_admin = {
        "name": user.sadmin_name,
        "email": user.sadmin_email,
      };

      return res.status(200).json({
        "message": "User fetched successfully!",
        "data": super_admin,
      });
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }

  public async getAllSuperAdmins(_req: CustomRequest, res: Response) {
    try {
      const connection = Database.init();

      const promiseConnection = connection.promise();

      const sql = `SELECT * from ${tableName}`;

      const [rows]: [rows: ISuperAdmin[]] = await promiseConnection.query(sql);

      const super_admins = rows?.map((sadmin: ISuperAdmin) => ({
        "id": sadmin.sadmin_id,
        "name": sadmin.sadmin_name,
        "email": sadmin.sadmin_email,
      }));

      return res.status(200).json({
        "message": "Users fetched successfully!",
        "data": super_admins,
      });
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }

  public async updateSuperAdmin(req: CustomRequest, res: Response) {
    try {
      const { name: updatedName } = req.body;
      const sAdminID = req.id;

      const connection = Database.init();

      const promiseConnection = connection.promise();

      const getSQL = `SELECT * FROM ${tableName} WHERE sadmin_id =?`;
      const getValues = [sAdminID];

      const [getRows]: [getRows: ISuperAdmin[]] = await promiseConnection.query(
        getSQL,
        getValues
      );

      if (!getRows.length) {
        return res.status(400).json({ "message": "User does not exists!" });
      }

      const updateQuery = `UPDATE ${tableName} SET sadmin_name =? WHERE sadmin_id =?`;
      const updateValues = [updatedName, sAdminID];

      await promiseConnection.query(updateQuery, updateValues);

      const [getUpdatedRows]: [getUpdatedRows: ISuperAdmin[]] =
        await promiseConnection.query(getSQL, getValues);

      if (!getUpdatedRows.length) {
        return res.status(404).json({ "message": "User does not exists!" });
      }

      const user = getUpdatedRows[0];

      const super_admin = {
        "name": user.sadmin_name,
        "email": user.sadmin_email,
      };

      return res.status(201).json({
        "message": "User updated successfully!",
        "data": super_admin,
      });
    } catch (error: any) {
      return res
        .status(Number(error.code) || 500)
        .json({ "message": error.message });
    }
  }
}
