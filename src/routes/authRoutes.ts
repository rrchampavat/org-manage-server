import { Router } from "express";

import AuthController from "../controllers/AuthController";
import validate from "../middlewares/Validation";
import {
  superAdminLoginSchema,
  superAdminRegisterSchema,
} from "../utils/validationSchemas";
import { logErrorMiddleware, returnError } from "../middlewares/Errors";

const router = Router();

const authControllerOBJ = new AuthController();

router.post(
  "/admin/login",
  validate(superAdminLoginSchema),
  authControllerOBJ.superAdminLogin,
  logErrorMiddleware,
  returnError
);

router.post(
  "/admin/register",
  validate(superAdminRegisterSchema),
  authControllerOBJ.superAdminRegister
);

router.post("/admin/logout", authControllerOBJ.logout);

router.post("/register", authControllerOBJ.usersRegister);

export default router;
