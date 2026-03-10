import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import bcrypt from "bcrypt";

// login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está configurado");
  }

  if (!email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
