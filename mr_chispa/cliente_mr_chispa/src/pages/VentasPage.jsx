import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

export const VentasPage = () => {
  const [products, setProducts] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data.ok) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [navigate]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => item.id_producto === producto.id_producto,
      );

      if (existe) {
        return prevCarrito.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id_producto !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const confirmarVenta = () => {
    const token = localStorage.getItem("token");

    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const total = carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    );

    const detalles = carrito.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: parseFloat(item.precio),
    }));

    const venta = {
      total,
      detalles,
    };

    fetch("http://localhost:3000/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venta),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("venta guardada:", data);
        setCarrito([]);
      })
      .catch((error) => {
        console.error("error al enviar venta:", error);
      });
  };

  return (
    <div>
      <div className="ventas-container">
        <div className="productos">
          <input
            className="buscador-productos"
            type="text"
            placeholder="Buscar producto..."
          />
          <ProductList products={products} onAddToCart={agregarAlCarrito} />
        </div>

        <div className="carrito">
          <Cart
            carrito={carrito}
            eliminarDelCarrito={eliminarDelCarrito}
            vaciarCarrito={vaciarCarrito}
            confirmarVenta={confirmarVenta}
          />
        </div>
      </div>
    </div>
  );
};
