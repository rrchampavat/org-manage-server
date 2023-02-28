import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/admin/login", new AuthController().superAdminLogin);
router.post("/admin/register", new AuthController().superAdminRegister);

export default router;
