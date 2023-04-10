import { Router } from "express";
import { VerifySuperAdmin } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";
import { VerifySameUser } from "../middlewares/VerifySameUser";

const router = Router();

const verifySuperAdminOBJ = new SAdminController();

router
  .get("/super-admin/:id?", VerifySuperAdmin, verifySuperAdminOBJ.getSuperAdmin)
  .put(
    "/super-admin",
    VerifySuperAdmin,
    VerifySameUser,
    verifySuperAdminOBJ.updateSuperAdmin
  );

router.get(
  "/super-admins",
  VerifySuperAdmin,
  verifySuperAdminOBJ.getAllSuperAdmins
);

export default router;
