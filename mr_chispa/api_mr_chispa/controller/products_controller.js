import { db } from "../config/db.js";

// obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.status(200).json({
      ok: true,
      data: rows,
    });
  } catch (error) {
    console.log("error al obtener los productos", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener los productos",
    });
  }
};

// obtener un producto por id
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }

    res.status(200).json({
      ok: true,
      data: rows[0],
    });
  } catch (error) {
    console.log("error al obtener el producto por id", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener el producto por id",
    });
  }
};

// crear un nuevo producto
export const createProduct = async (req, res) => {
  const { nombre, precio, stock } = req.body;

  if (!nombre || !precio || !stock) {
    return res.status(400).json({
      ok: false,
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre, precio, stock ?? 0],
    );
    res.status(201).json({
      ok: true,
      message: "Producto creado exitosamente",
      data: {
        id_producto: result.insertId,
        nombre,
        precio,
        stock: stock ?? 0,
      },
    });
  } catch (error) {
    console.log("error al crear el producto", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear el producto",
    });
  }
};

// actualizar un producto por id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({
      ok: false,
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id_producto = ?",
      [nombre, precio, stock, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.log("error al actualizar el producto", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar el producto",
    });
  }
};

// eliminar un producto por id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.log("error al eliminar el producto", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar el producto",
    });
  }
};
