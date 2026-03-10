import { Router } from "express";
import {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
} from "../controller/ventas_controller.js";

const router = Router();

router.get("/ventas", obtenerVentas);
router.get("/ventas/:id", obtenerVentaPorId);

router.post("/ventas", crearVenta);

export default router;
