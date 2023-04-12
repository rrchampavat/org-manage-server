import { Router } from "express";
import { VerifyJWTToken } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";
import { VerifySameUser } from "../middlewares/VerifySameUser";
import { isSuperAdmin } from "../middlewares/VerifyRole";
import { validate } from "../middlewares/Validation";
import { getSuperAdminSchema, idValidation } from "../utils/validationSchemas";

const router = Router();

const verifySuperAdminOBJ = new SAdminController();

router
  .get(
    "/super-admin/:id?",
    VerifyJWTToken,
    isSuperAdmin,
    validate(getSuperAdminSchema),
    verifySuperAdminOBJ.getSuperAdmin
  )
  .put(
    "/super-admin",
    VerifyJWTToken,
    isSuperAdmin,
    VerifySameUser,
    validate(getSuperAdminSchema),
    verifySuperAdminOBJ.updateSuperAdmin
  );

router.get(
  "/super-admins",
  VerifyJWTToken,
  isSuperAdmin,
  validate(getSuperAdminSchema),
  verifySuperAdminOBJ.getAllSuperAdmins
);

export default router;
