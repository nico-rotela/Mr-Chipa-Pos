import { useEffect, useState } from "react";

export const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/ventas")
      .then((res) => res.json())
      .then((data) => {
        setVentas(data);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }, []);

  const verDetalleVenta = (idVenta) => {
    fetch(`http://localhost:3000/api/ventas/${idVenta}`)
      .then((res) => res.json())
      .then((data) => {
        setVentaSeleccionada(data);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  return (
    <div className="historial-container">
      <h1 className="historial-titulo">Historial de Ventas</h1>

      <div className="historial-layout">
        <div className="historial-ventas">
          <ul className="historial-lista">
            {ventas.map((venta) => (
              <li className="historial-card" key={venta.id_venta}>
                <div className="historial-info">
                  <span className="historial-id">Venta #{venta.id_venta}</span>
                  <span className="historial-total">${venta.total}</span>
                </div>

                <button
                  className="btn-detalle"
                  onClick={() => verDetalleVenta(venta.id_venta)}
                >
                  Ver detalle
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="historial-detalle">
          {ventaSeleccionada && (
            <div className="detalle-card">
              <h2 className="detalle-titulo">
                Detalle venta #{ventaSeleccionada.venta.id_venta}
              </h2>

              <div className="detalle-tabla">
                <div className="detalle-header">
                  <span>Producto</span>
                  <span>Cant.</span>
                  <span>Precio</span>
                  <span>Subtotal</span>
                </div>

                {ventaSeleccionada.detalles.map((item) => (
                  <div className="detalle-item" key={item.id_producto}>
                    <span>{item.nombre}</span>
                    <span>{item.cantidad}</span>
                    <span>${item.precio_unitario}</span>
                    <span>${item.precio_unitario * item.cantidad}</span>
                  </div>
                ))}
              </div>

              <div className="detalle-total">
                Total: ${ventaSeleccionada.venta.total}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
