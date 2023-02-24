import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/admin/login", new AuthController().adminLogin);
router.post("/admin/register", new AuthController().adminRegister);

export default router;
