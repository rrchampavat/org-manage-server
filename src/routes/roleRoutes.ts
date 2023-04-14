import { Router } from "express";

import {
  createRole,
  getRole,
  getRoles,
  updateRole,
} from "../controllers/roleController";
import { VerifyJWTToken } from "../middlewares/JWTVerify";
import { isSuperAdmin } from "../middlewares/VerifyRole";
import {
  createRoleSchema,
  idValidation,
  paramsIDSchema,
  updateRoleSchema,
} from "../utils/validationSchemas";
import validate from "../middlewares/Validation";

const router = Router();

router
  .route("/role/:id?")
  .get(VerifyJWTToken, isSuperAdmin, validate(paramsIDSchema), getRole)
  .post(VerifyJWTToken, isSuperAdmin, validate(createRoleSchema), createRole)
  .put(VerifyJWTToken, isSuperAdmin, validate(updateRoleSchema), updateRole);

router
  .route("/roles")
  .get(VerifyJWTToken, isSuperAdmin, validate(idValidation), getRoles);

export default router;
