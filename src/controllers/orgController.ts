import { Response } from "express";
import { CustomRequest } from "../utils/interfaces";
import Database from "../db/dbConnection";
import { IOrganization } from "../models/interfaces";

const tableName = "organizations";

export const createOrg = async (req: CustomRequest, res: Response) => {
  try {
    const { id: SAdminID, body } = req;
    const { name: orgName, country, prmEmail, scdEmail } = body;

    if (!orgName || !country || !prmEmail || !scdEmail) {
      return res
        .status(400)
        .json({ "message": "Please provide all the required fields!" });
    }

    const connection = Database.init();

    const promiseConnection = connection.promise();

    const searchSQL = `SELECT * FROM ${tableName} WHERE org_name =?`;
    const getOrgValues = [orgName];

    const [getOrgRows]: [getOrgRows: IOrganization[]] =
      await promiseConnection.query(searchSQL, getOrgValues);

    if (getOrgRows?.length) {
      return res
        .status(400)
        .json({ "message": "Organization name is already taken!" });
    }

    const insertSQL = `INSERT INTO ${tableName} (org_name, org_country, org_is_active, org_prm_email, org_scd_email, org_created_by) VALUES (?,?,?,?,?,?)`;
    const insertValues = [orgName, country, true, prmEmail, scdEmail, SAdminID];

    const [rows]: [rows: IOrganization[]] = await promiseConnection.query(
      insertSQL,
      insertValues
    );

    const newOrg = rows[0];

    return res.status(201).json({
      "message": "Organization created successfully!",
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

    const [rows]: [rows: IOrganization[]] = await promiseConnection.query(
      getSQL
    );

    return res
      .status(200)
      .json({ "message": "Organizations fetched successfully!", "data": rows });
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

    const [rows]: [rows: IOrganization[]] = await promiseConnection.query(
      getSQL,
      getValues
    );

    if (!rows?.length) {
      return res.status(404).json({ "message": "Organization not found!" });
    }

    const org = rows[0];

    return res
      .status(200)
      .json({ "message": "Organization fetched successfully!", "data": org });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.code });
  }
};
