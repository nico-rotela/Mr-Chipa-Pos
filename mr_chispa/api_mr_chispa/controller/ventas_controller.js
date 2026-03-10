import { db } from "../config/db.js";

export const crearVenta = async (req, res) => {
  const { total, detalles } = req.body;

  try {
    //  insertar la venta
    const idVenta = await insertarVenta(total);

    console.log("ID VENTA:", idVenta);
    console.log("DETALLES RECIBIDOS:", detalles);

    //  recorrer los productos vendidos
    for (const item of detalles) {
      console.log("item desde el for:", item);

      //  insertar detalle de venta
      await insertarDetalle(idVenta, item);

      //  actualizar stock del producto
      await actualizarStock(item);
    }

    //  respuesta al frontend
    res.json({ message: "Venta creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la venta:", error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};

// INSERT VENTA
async function insertarVenta(total) {
  const [result] = await db.query("INSERT INTO ventas (total) VALUES (?)", [
    total,
  ]);

  return result.insertId;
}

// INSERT DETALLE
async function insertarDetalle(idVenta, item) {
  await db.query(
    "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
    [idVenta, item.id_producto, item.cantidad, item.precio_unitario],
  );
}

// ACTUALIZAR STOCK
async function actualizarStock(item) {
  await db.query(
    "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
    [item.cantidad, item.id_producto],
  );
}

// OBTENER VENTAS
export const obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await db.query("SELECT * FROM ventas ORDER BY fecha DESC");

    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

export const obtenerVentaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    // buscar la venta
    const [ventas] = await db.query("SELECT * FROM ventas WHERE id_venta = ?", [
      id,
    ]);

    if (ventas.length === 0) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    const venta = ventas[0];

    // buscar los productos de la venta
    const [detalles] = await db.query(
      `SELECT 
        dv.id_producto,
        p.nombre,
        dv.cantidad,
        dv.precio_unitario
      FROM detalle_venta dv
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?`,
      [id],
    );

    res.json({
      venta,
      detalles,
    });
  } catch (error) {
    console.error("Error al obtener venta:", error);
    res.status(500).json({ error: "Error al obtener venta" });
  }
};
