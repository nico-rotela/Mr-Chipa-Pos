function ProductList({ products, onDelete, onAddToCart, onEdit }) {
  if (!products || products.length === 0) {
    return <p>No hay productos</p>;
  }

  return (
    <ul className="productos">
      {products.map((product) => (
        <li key={product.id_producto}>
          <div className="producto-nombre">{product.nombre}</div>

          <div className="producto-precio">${product.precio}</div>

          <div className="producto-stock">Stock: {product.stock}</div>

          <div className="producto-botones">
            {onDelete && (
              <button
                className="btn-eliminar"
                onClick={() => onDelete(product.id_producto)}
              >
                Eliminar
              </button>
            )}

            {onEdit && (
              <button className="btn-editar" onClick={() => onEdit(product)}>
                Editar
              </button>
            )}

            {onAddToCart && (
              <button
                className="btn-agregar"
                onClick={() => onAddToCart(product)}
              >
                Agregar al carrito
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
