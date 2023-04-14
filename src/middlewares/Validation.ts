import { AnyZodObject } from "zod";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { CustomRequest } from "../utils/interfaces";

const validate =
  (schema: AnyZodObject) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { body, params, id, headers } = req;

      const token = headers["authorization"]?.split(" ")?.[1];

      if (!token) throw new Error("Token is missing!");

      const decodedToken = jwt.verify(
        token,
        process.env.SUPER_ADMIN_SECRET_KEY!,
        { ignoreExpiration: true }
      ) as JwtPayload;

      await schema.parseAsync({
        body: body,
        // query: query,
        params: params,
        id: id,
        jwtToken: decodedToken,
      });

      return next();
    } catch (error: any) {
      const errorOBJ = JSON.parse(error?.message);

      return res
        .status(Number(error.code) || 500)
        .json({ "message": errorOBJ?.[0]?.message || error.message });
    }
  };

export default validate;
