import { Response } from "express";

import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import { IRole } from "../models/interfaces";

const tableName = "roles";

export const createRole = async (req: CustomRequest, res: Response) => {
  try {
    const { body } = req;
    const { name: roleName } = body;

    const connection = Database.init();
    const promiseConnection = connection.promise();

    const getSQL = `SELECT * FROM ${tableName} WHERE role_name =?`;
    const getValues = [roleName];

    const [rows]: [rows: IRole[]] = await promiseConnection.query(
      getSQL,
      getValues
    );

    if (rows.length) {
      return res.status(400).json({ "message": "Role already exists!" });
    }

    const insertSQL = `INSERT INTO ${tableName} (role_name) VALUES (?)`;
    const insertValues = [roleName];

    await promiseConnection.query(insertSQL, insertValues);

    return res.status(201).json({ "message": "Role created successfully!" });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};

export const getRoles = async (_req: CustomRequest, res: Response) => {
  try {
    const connection = Database.init();
    const promiseConnection = connection.promise();

    const sql = `SELECT * FROM ${tableName}`;

    const [rows]: [rows: IRole[]] = await promiseConnection.query(sql);

    return res
      .status(200)
      .json({ "message": "Roles fetched successfully!", "data": rows });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};

export const getRole = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const connection = Database.init();
    const promiseConnection = connection.promise();

    const sql = `SELECT * FROM ${tableName} WHERE role_id =?`;
    const values = [id];

    const [rows]: [rows: IRole[]] = await promiseConnection.query(sql, values);

    if (!rows.length) {
      return res.status(404).json({ "message": "Role not found!" });
    }

    const role = rows[0];

    return res
      .status(200)
      .json({ "message": "Role fetched successfully!", "data": role });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};

export const updateRole = async (req: CustomRequest, res: Response) => {
  try {
    const { name: updatedRoleName } = req.body;
    const { id } = req.params;

    const connection = Database.init();
    const promiseConnection = connection.promise();

    const getSQL = `SELECT * FROM ${tableName} WHERE role_id =?`;
    const getValues = [id];

    const [rows]: [rows: IRole[]] = await promiseConnection.query(
      getSQL,
      getValues
    );

    if (!rows?.length) {
      return res.status(404).json({ "message": "Role not found!" });
    }

    const updateSQL = `UPDATE ${tableName} SET role_name =? WHERE role_id =?`;
    const updateValues = [updatedRoleName, id];

    await promiseConnection.query(updateSQL, updateValues);

    const [updatedRows]: [updatedRows: IRole[]] = await promiseConnection.query(
      getSQL,
      getValues
    );

    const updatedRole = updatedRows[0];

    return res
      .status(201)
      .json({ "message": "Role updated successfully!", "data": updatedRole });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};
