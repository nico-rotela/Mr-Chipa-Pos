import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controller/userController.js";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.post("/user", createUser);
router.put("/user/:id", updateUser);

export default router;
