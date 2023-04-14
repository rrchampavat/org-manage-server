import { Router } from "express";
import AuthController from "../controllers/AuthController";
import validate from "../middlewares/Validation";
import {
  superAdminLoginSchema,
  superAdminRegisterSchema,
} from "../utils/validationSchemas";

const router = Router();

const authControllerOBJ = new AuthController();

router.post(
  "/admin/login",
  validate(superAdminLoginSchema),
  authControllerOBJ.superAdminLogin
);

router.post(
  "/admin/register",
  validate(superAdminRegisterSchema),
  authControllerOBJ.superAdminRegister
);

router.post("/admin/logout", authControllerOBJ.logout);

export default router;
