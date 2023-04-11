import { Router } from "express";
import { VerifyJWTToken } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";
import { VerifySameUser } from "../middlewares/VerifySameUser";
import { isSuperAdmin } from "../middlewares/VerifyRole";

const router = Router();

const verifySuperAdminOBJ = new SAdminController();

router
  .get(
    "/super-admin/:id?",
    VerifyJWTToken,
    isSuperAdmin,
    verifySuperAdminOBJ.getSuperAdmin
  )
  .put(
    "/super-admin",
    VerifyJWTToken,
    isSuperAdmin,
    VerifySameUser,
    verifySuperAdminOBJ.updateSuperAdmin
  );

router.get(
  "/super-admins",
  isSuperAdmin,
  VerifyJWTToken,
  verifySuperAdminOBJ.getAllSuperAdmins
);

export default router;
