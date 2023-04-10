import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

const authControllerOBJ = new AuthController();

router.post("/admin/login", authControllerOBJ.superAdminLogin);
router.post("/admin/register", authControllerOBJ.superAdminRegister);
router.post("/admin/logout", authControllerOBJ.logout);

export default router;
