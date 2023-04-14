import { Response } from "express";

import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import { IOrganisation } from "../models/interfaces";
import sendEmail from "../utils/sendEmail";

const tableName = "organisations";

export const createOrg = async (req: CustomRequest, res: Response) => {
  try {
    const { id: SAdminID, body } = req;
    const { name: orgName, country, prmEmail, scdEmail } = body;

    const connection = Database.init();

    const promiseConnection = connection.promise();

    const searchSQL = `SELECT * FROM ${tableName} WHERE org_name =?`;
    const getOrgValues = [orgName];

    const [getOrgRows]: [getOrgRows: IOrganisation[]] =
      await promiseConnection.query(searchSQL, getOrgValues);

    if (getOrgRows?.length) {
      return res
        .status(400)
        .json({ "message": "Organisation name is already taken!" });
    }

    const insertSQL = `INSERT INTO ${tableName} (org_name, org_country, org_is_active, org_prm_email, org_scd_email, org_created_by) VALUES (?,?,?,?,?,?)`;
    const insertValues = [orgName, country, true, prmEmail, scdEmail, SAdminID];

    const [rows]: [rows: IOrganisation[]] = await promiseConnection.query(
      insertSQL,
      insertValues
    );

    const emailContent = {
      receiverEmails: [prmEmail, scdEmail],
      subject: "Welcome to Organisations Management!",
      html: `<p>Congratulations, You've been added as an admin in the <b><i>${orgName}</i></b> organisation! 
            </br></br> Regards, 
            </br> ORG Management Team</p>`,
    };

    await sendEmail(emailContent);

    const newOrg = rows[0];

    return res.status(201).json({
      "message": "Organisation created successfully!",
      "data": newOrg,
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

    const getSQL = `SELECT * FROM ${tableName}`;

    const [rows]: [rows: IOrganisation[]] = await promiseConnection.query(
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

    const getSQL = `SELECT * FROM ${tableName} WHERE org_id =?`;
    const getValues = [id];

    const [rows]: [rows: IOrganisation[]] = await promiseConnection.query(
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
      .json({ "message": error.code });
  }
};
