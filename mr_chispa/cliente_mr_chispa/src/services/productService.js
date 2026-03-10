// traigo los productos desde el backend
export const getProducts = async () => {
  const response = await fetch("http://localhost:3000/api/products");

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  const data = await response.json();
  return data;
};

// elimino un producto por su id
export const deleteProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  return data;
};

// creo un nuevo producto
export const createProduct = async (product) => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Error al crear producto");
  }

  const data = await response.json();
  return data;
};

// actualizo un producto por su id
export const updateProduct = async (id, Product) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(Product),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar producto");
  }

  const data = await response.json();
  return data;
};
