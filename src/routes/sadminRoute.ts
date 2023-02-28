import { Router } from "express";
import { VerifySuperAdmin } from "../middlewares/JWTVerify";
import SAdminController from "../controllers/SAdminController";

const router = Router();

router.get(
  "/super-admins",
  VerifySuperAdmin,
  new SAdminController().getSuperAdmin
);

export default router;
