import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/products_controller.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// rutas para productos
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// admin
router.post("/products", auth, isAdmin, createProduct);
router.put("/products/:id", auth, isAdmin, updateProduct);
router.delete("/products/:id", auth, isAdmin, deleteProduct);

export default router;
