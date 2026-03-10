import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  createProduct,
} from "../services/productService";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const navigate = useNavigate();

  // Cargar los productos al montar el componente
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

  // Función para eliminar un producto
  const handleDelete = async (id) => {
    try {
      const data = await deleteProduct(id);

      if (data.ok) {
        setProducts((prev) =>
          prev.filter((product) => product.id_producto !== id),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Función para agregar un nuevo producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: name,
      precio: parseFloat(price),
      stock: parseInt(stock),
    };

    console.log("enviado al backend:", newProduct);
    try {
      const createdProduct = await createProduct(newProduct);

      console.log("respuesta del backend: ", createdProduct);

      setProducts((prev) => [...prev, createdProduct]);
      setName("");
      setPrice("");
      setStock("");
    } catch (error) {
      console.error("error al crear producto:", error);
    }
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find(
        (item) => item.id_producto === producto.id_producto,
      );

      if (existe) {
        // Si ya está en el carrito, aumenta cantidad
        return prevCarrito.map((item) =>
          item.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      } else {
        // Si no está, lo agrega con cantidad 1
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => item.id_producto !== id),
    );
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Función para confirmar la venta
  const confirmarVenta = () => {
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

    console.log("Venta a enviar al backend:", venta);

    // Enviar la venta al backend
    fetch("http://localhost:3000/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(venta),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
      })
      .catch((error) => {
        console.error("Error al enviar venta:", error);
      });
  };

  return (
    <div>
      <h1>Productos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio del producto"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button type="submit">Agregar Producto</button>
      </form>
      <ProductList
        products={products}
        onDelete={handleDelete}
        onAddToCart={agregarAlCarrito}
      />
      <Cart
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        vaciarCarrito={vaciarCarrito}
        confirmarVenta={confirmarVenta}
      />
    </div>
  );
}

export default ProductsPage;
