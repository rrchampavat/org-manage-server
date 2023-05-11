import { Response } from "express";

import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import sendEmail from "../utils/sendEmail";
import { ResultSetHeader } from "mysql2";
import {
  orgTableKeys,
  orgTableName,
  roleTableKeys,
  roleTableName,
  userTableKeys,
  userTableName,
} from "../db/utils";
import { hash } from "bcryptjs";
import { Organisation, Role } from "./types";

export const createOrg = async (req: CustomRequest, res: Response) => {
  try {
    const { id: SAdminID, body } = req;
    const {
      name: orgName,
      country,
      prmEmail,
      scdEmail,
      established_date,
    } = body;

    const connection = Database.init();

    const promiseConnection = connection.promise();

    const searchSQL = `SELECT * FROM ${orgTableName} WHERE ${orgTableKeys.name} =?`;
    const getOrgValues = [orgName];

    const [getOrgRows]: [getOrgRows: Organisation[]] =
      await promiseConnection.query(searchSQL, getOrgValues);

    if (getOrgRows?.length) {
      return res
        .status(400)
        .json({ "message": "Organisation name is already taken!" });
    }

    const orgInsertSQL = `INSERT INTO ${orgTableName} (${orgTableKeys.name}, ${orgTableKeys.country},${orgTableKeys.prm_email}, ${orgTableKeys.scd_email}, ${orgTableKeys.created_by}, ${orgTableKeys.establish_date}) VALUES (?,?,?,?,?,?)`;
    const orgInsertValues = [
      orgName,
      country,
      prmEmail,
      scdEmail,
      SAdminID,
      new Date(established_date),
    ];

    const [orgRows]: [orgRows: ResultSetHeader] = await promiseConnection.query(
      orgInsertSQL,
      orgInsertValues
    );

    const orgID = orgRows.insertId;

    const getRolesSQL = `SELECT * FROM ${roleTableName} WHERE ${roleTableKeys.id} =? AND ${roleTableKeys.name} = 'Admin'`;
    const getRoleValues = [orgID];

    const [roles]: [roles: Role[]] = await promiseConnection.query(
      getRolesSQL,
      getRoleValues
    );

    let roleID = roles?.[0]?.role_id;

    if (!roles?.length) {
      const insertRoleSQL = `INSERT INTO ${roleTableName} (${roleTableKeys.name}, ${roleTableKeys.org_id}) VALUES (?,?)`;
      const insertRoleValues = ["Admin", orgID];

      const [role]: [role: ResultSetHeader] = await promiseConnection.query(
        insertRoleSQL,
        insertRoleValues
      );

      roleID = role.insertId;
    }

    const prmHashedPassword = await hash(prmEmail, 10);
    const scdHashedPassword = await hash(scdEmail, 10);

    const userInsetSQL = `INSERT INTO ${userTableName} (${userTableKeys.email}, ${userTableKeys.password}, ${userTableKeys.org_id}, ${userTableKeys.role_id}) VALUES ?`;
    const userInsertValues = [
      [
        [prmEmail, prmHashedPassword, orgID, roleID],
        [scdEmail, scdHashedPassword, orgID, roleID],
      ],
    ];

    await promiseConnection.query(userInsetSQL, userInsertValues);

    // const emailContent = {
    //   receiverEmails: [prmEmail, scdEmail],
    //   subject: "Welcome to Organisations Management!",
    //   html: `<p>Congratulations, You've been added as an admin in the <b><i>${orgName}</i></b> organisation!
    //         </br></br> Regards,
    //         </br> ORG Management Team</p>`,
    // };

    // sendEmail(emailContent);

    return res.status(201).json({
      "message": "Organisation created successfully!",
    });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};

export const getOrgs = async (_req: CustomRequest, res: Response) => {
  try {
    const connection = Database.init();

    const promiseConnection = connection.promise();

    const getSQL = `SELECT * FROM ${orgTableName}`;

    const [rows]: [rows: Organisation[]] = await promiseConnection.query(
      getSQL
    );

    return res
      .status(200)
      .json({ "message": "Organisations fetched successfully!", "data": rows });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.code });
  }
};

export const getOrg = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const connection = Database.init();

    const promiseConnection = connection.promise();

    const getSQL = `SELECT * FROM ${orgTableName} WHERE ${orgTableKeys.id} =?`;
    const getValues = [id];

    const [rows]: [rows: Organisation[]] = await promiseConnection.query(
      getSQL,
      getValues
    );

    if (!rows?.length) {
      return res.status(404).json({ "message": "Organisation not found!" });
    }

    const org = rows[0];

    return res
      .status(200)
      .json({ "message": "Organisation fetched successfully!", "data": org });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};
