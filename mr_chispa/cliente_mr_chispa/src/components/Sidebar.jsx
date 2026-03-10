import { Link } from "react-router-dom";
import { useState } from "react";

export const Sidebar = () => {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/ventas" className="sidebar-link">
          <img src="/icons/icon_ventas.png" className="sidebar-icon" />
        </Link>

        {user?.rol === "admin" && (
          <Link to="/productos" className="sidebar-link">
            <img src="/icons/icon_productos.png" className="sidebar-icon" />
          </Link>
        )}

        <Link to="/historial" className="sidebar-link">
          <img src="/icons/icon_historial.png" className="sidebar-icon" />
        </Link>
      </div>

      <div className="sidebar-bottom">
        <img className="sidebar-logo" src="/logo.png" alt="mr chispa logo" />

        <div className="sidebar-user">
          <span>{user?.nombre}</span>
          <button className="sidebar-logout" onClick={logout}>
            <img
              src="/icons/boton_logout_transparente.png"
              className="logout-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
