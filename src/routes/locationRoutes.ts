import { Router } from "express";
import { addLocation } from "../controllers/locationController";

const router = Router();

router.route("/location").post(addLocation);

export default router;
