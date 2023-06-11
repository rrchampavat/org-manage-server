import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/interfaces";
import { BaseError } from "../utils/ErrorHandling/baseError";

export const logError = (err: string) => {
  console.error(err);
};

export const logErrorMiddleware = (
  err: any,
  _req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  logError(err);
  isOperationalError(err);
  next(err);
};

export const returnError = (
  err: any,
  _req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.status(err.code || 500).json({ error: err.message });
};

export const isOperationalError = (err: any) => {
  if (err instanceof BaseError) {
    return err.isOperational;
  }

  return false;
};
