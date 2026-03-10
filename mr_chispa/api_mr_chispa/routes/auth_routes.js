import { login } from "../controller/auth_controller.js";
import { Router } from "express";
const router = Router();
// ruta de login
router.post("/login", login);

export default router;
