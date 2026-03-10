function Cart({ carrito, eliminarDelCarrito, vaciarCarrito, confirmarVenta }) {
  if (carrito.length === 0) {
    return (
      <div>
        <h3>ticket</h3>
        <p>El ticket está vacío</p>
      </div>
    );
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <div>
      <h3 className="carrito-titulo">ticket</h3>

      <ul className="carrito-lista">
        {carrito.map((item) => (
          <li className="carrito-item" key={item.id_producto}>
            <div className="carrito-info">
              {item.nombre} - ${item.precio} x {item.cantidad}
            </div>

            <button
              className="btn-eliminar-item"
              onClick={() => eliminarDelCarrito(item.id_producto)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="carrito-total">
        <span className="total-label">Total</span>
        <span className="total-precio">${total}</span>
      </div>
      <button className="btn-vaciar" onClick={vaciarCarrito}>
        Vaciar carrito
      </button>

      <button className="btn-confirmar" onClick={confirmarVenta}>
        Confirmar venta
      </button>
    </div>
  );
}

export default Cart;
