import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  "id"?: number;
}

export interface DecodedToken extends JwtPayload {
  "id": number;
  "iat": number;
}
