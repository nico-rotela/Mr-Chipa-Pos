import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { VentasPage } from "./pages/VentasPage";
import { AdminPage } from "./pages/AdminPage";
import { HistorialVentas } from "./pages/HistorialVentas";
import { Sidebar } from "./components/Sidebar";
import "./styles/main.css";
import "./styles/carrito.css";
import "./styles/sidebar.css";
import "./styles/productos.css";
import "./styles/ventas.css";
import "./styles/admin.css";
import "./styles/historial.css";
import "./styles/login.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div className="app-layout">
        {token && <Sidebar />}

        <div className="app-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/ventas" element={<VentasPage />} />
            <Route path="/productos" element={<AdminPage />} />
            <Route path="/historial" element={<HistorialVentas />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
