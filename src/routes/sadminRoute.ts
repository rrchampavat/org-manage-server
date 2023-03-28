import { Router } from "express";
import { VerifySuperAdmin } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";

const router = Router();

router.get(
  "/super-admin",
  VerifySuperAdmin,
  new SAdminController().getLoggedSuperAdmin
);
router.get(
  "/super-admins",
  VerifySuperAdmin,
  new SAdminController().getAllSuperAdmins
);

export default router;
