import { Router } from "express";
import { createOrg, getOrg, getOrgs } from "../controllers/orgController";
import { VerifyJWTToken } from "../middlewares/JWTVerify";
import { isSuperAdmin } from "../middlewares/VerifyRole";
import { validate } from "../middlewares/Validation";
import { createOrgSchema, paramsIDSchema } from "../utils/validationSchemas";

const router = Router();

router
  .route("/organization/:id?")
  .get(VerifyJWTToken, isSuperAdmin, validate(paramsIDSchema), getOrg)
  .post(VerifyJWTToken, isSuperAdmin, validate(createOrgSchema), createOrg);

router.get("/organizations", VerifyJWTToken, isSuperAdmin, getOrgs);

export default router;
