import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, email, rol FROM usuarios",
    );
    res.status(200).json({
      ok: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, email, rol FROM usuarios WHERE id_usuario = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }
    res.status(200).json({
      ok: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};

export const createUser = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const rolFinal = rol === "admin" ? "admin" : "user";

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, passwordHash, rolFinal],
    );

    const idUsuario = result.insertId;

    res.status(201).json({
      ok: true,
      data: {
        id: idUsuario,
        nombre,
        email,
        rol: rolFinal,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;
  const rolFinal = rol === "admin" ? "admin" : "user";

  if (!nombre || !email) {
    return res.status(400).json({
      ok: false,
      message: "Faltan campos obligatorios",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?",
      [nombre, email, rolFinal, id],
    );
    res.status(200).json({
      ok: true,
      message: "Usuario actualizado correctamente",
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
    });
  }
};
