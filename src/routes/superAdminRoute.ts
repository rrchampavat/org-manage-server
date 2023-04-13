import { Router } from "express";
import { VerifyJWTToken } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";
import { VerifySameUser } from "../middlewares/VerifySameUser";
import { isSuperAdmin } from "../middlewares/VerifyRole";
import { validate } from "../middlewares/Validation";
import { getSuperAdminSchema } from "../utils/validationSchemas";

const router = Router();

const verifySuperAdminOBJ = new SAdminController();

router
  .route("/super-admin/:id?")
  .get(
    VerifyJWTToken,
    isSuperAdmin,
    validate(getSuperAdminSchema),
    verifySuperAdminOBJ.getSuperAdmin
  )
  .put(
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
