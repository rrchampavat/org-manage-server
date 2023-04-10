import { Router } from "express";
import { VerifySuperAdmin } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";
import { VerifySameUser } from "../middlewares/VerifySameUser";

const router = Router();

router
  .get(
    "/super-admin/:id?",
    VerifySuperAdmin,
    new SAdminController().getSuperAdmin
  )
  .put(
    "/super-admin",
    VerifySuperAdmin,
    VerifySameUser,
    new SAdminController().updateSuperAdmin
  );

router.get(
  "/super-admins",
  VerifySuperAdmin,
  new SAdminController().getAllSuperAdmins
);

export default router;
