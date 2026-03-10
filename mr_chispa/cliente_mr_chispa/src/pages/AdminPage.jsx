import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../services/productService";
import ProductList from "../components/ProductList";

export const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const handleEdit = (product) => {
    console.log("Editando", product);
    setName(product.nombre);
    setPrice(product.precio);
    setStock(product.stock);
    setEditingId(product.id_producto);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      nombre: name,
      precio: parseFloat(price),
      stock: parseInt(stock),
    };

    try {
      if (editingId) {
        const data = await updateProduct(editingId, newProduct);

        if (data.ok) {
          setProducts((prev) =>
            prev.map((product) =>
              product.id_producto === editingId
                ? { ...product, ...newProduct }
                : product,
            ),
          );

          setEditingId(null);
        }
      } else {
        const createdProduct = await createProduct(newProduct);

        setProducts((prev) => [...prev, createdProduct]);
      }

      setName("");
      setPrice("");
      setStock("");
    } catch (error) {
      console.error("error al guardar producto:", error);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-titulo">Panel Admin</h1>

      <div className="admin-form-card">
        <h3 className="admin-form-titulo">
          {editingId ? "Editar producto" : "Agregar producto"}
        </h3>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button className="btn-crear" type="submit">
            {editingId ? "Actualizar producto" : "Crear producto"}
          </button>
        </form>
      </div>

      <div className="productos">
        <ProductList
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};
