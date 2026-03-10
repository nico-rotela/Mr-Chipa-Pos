import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products_routes.js";
import ventasRouter from "./routes/ventas_routes.js";
import userRoutes from "./routes/user_routes.js";
import authRoutes from "./routes/auth_routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// rutas
app.use("/api", productsRoutes);
app.use("/api", ventasRouter);
app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
