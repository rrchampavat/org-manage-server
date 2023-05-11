import { Request, Response } from "express";
import Database from "../db/dbConnection";
import {
  locationTableKeys,
  locationTableName,
  orgTableKeys,
  orgTableName,
} from "../db/utils";
import { ResultSetHeader } from "mysql2";
import { Location, Organisation } from "../types";

export const addLocation = async (req: Request, res: Response) => {
  try {
    const { city, state, country, pin, org_id, area } = req.body;

    const connection = Database.init();
    const promiseConnection = connection.promise();

    const getOrgSQL = `SELECT * FROM ${orgTableName} WHERE ${orgTableKeys.id} =?`;
    const getOrgValues = [org_id];

    const [orgs]: [orgs: Organisation[]] = await promiseConnection.query(
      getOrgSQL,
      getOrgValues
    );

    if (!orgs.length) {
      return res.status(404).json({ "message": "Organisation not found!" });
    }

    const getLocationsSQL = `SELECT * FROM ${locationTableName} WHERE ${locationTableKeys.area} =? OR ${locationTableKeys.pin} AND ${locationTableKeys.org_id}`;
    const getLocationsValues = [area, pin, org_id];

    const [locations]: [locations: Location[]] = await promiseConnection.query(
      getLocationsSQL,
      getLocationsValues
    );

    if (locations.length) {
      return res.status(400).json({ "message": "Location already exists!" });
    }

    const insertLocationSQL = `INSERT INTO ${locationTableName} (${locationTableKeys.area}, ${locationTableKeys.city}, ${locationTableKeys.country}, ${locationTableKeys.state}, ${locationTableKeys.pin}, ${locationTableKeys.org_id}) VALUES (?,?,?,?,?,?)`;
    const insertLocationValues = [area, city, country, state, pin, org_id];

    const [rows]: [rows: ResultSetHeader] = await promiseConnection.query(
      insertLocationSQL,
      insertLocationValues
    );

    const locationID = rows.insertId;

    const getLocationSQL = `SELECT * FROM ${locationTableName} WHERE ${locationTableKeys.id} =?`;
    const getLocationValues = [locationID];

    const [addedLoc]: [addedLoc: Location[]] = await promiseConnection.query(
      getLocationSQL,
      getLocationValues
    );

    const location = addedLoc[0];

    return res
      .status(201)
      .json({ "message": "Location added successfully!", "date": location });
  } catch (error: any) {
    return res
      .status(Number(error.code) || 500)
      .json({ "message": error.message });
  }
};
