// Componente principal: define el proveedor de autenticación y las rutas
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorAutenticacion } from "./contexto/ContextoAutenticacion";

import NavBar from "./componentes/NavBar";
import Footer from "./componentes/Footer";
import RutaPrivada from "./componentes/RutaPrivada";
import AsistenteVirtual from "./componentes/AsistenteVirtual";
import AvisoSesion from "./componentes/AvisoSesion";

// Páginas públicas
import Home from "./paginas/Home";
import Contacto from "./paginas/Contacto";
import NotFound from "./paginas/NotFound";
import ServicioManicura from "./paginas/ServicioManicura";
import ServicioPeluqueria from "./paginas/ServicioPeluqueria";
import ServicioMaquillaje from "./paginas/ServicioMaquillaje";
import ServicioSpa from "./paginas/ServicioSpa";
import ServicioDepilacion from "./paginas/ServicioDepilacion";
import RegistroCliente from "./componentes/RegistroCliente";

// Paneles privados (uno por rol)
import PanelPrivado from "./paginas/PanelPrivado";
import PanelCliente from "./paginas/PanelCliente";
import PanelPersonal from "./paginas/PanelPersonal";
import PanelAdministrador from "./paginas/PanelAdministrador";

// Componentes del administrador
import CrearPersonal from "./componentes/CrearPersonal";
import ListadoClientes from "./componentes/ListadoClientes";
import ListadoPersonal from "./componentes/ListadoPersonal";
import GestionServicios from "./componentes/GestionServicios";

// Componentes para todos los usuarios con sesión
import ListadoCitas from "./componentes/ListadoCitas";
import GestionArchivos from "./componentes/GestionArchivos";

import "./estilos/App.css";

export default function App() {
  return (
    // BrowserRouter va por fuera para que el contexto pueda redirigir
    // al inicio cuando la sesión se cierra por inactividad
    <BrowserRouter>
      <ProveedorAutenticacion>
        <NavBar />

        <Routes>
          {/* PÁGINAS PÚBLICAS (visitantes) */}
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<RegistroCliente />} />
          <Route path="/servicios/manicura" element={<ServicioManicura />} />
          <Route path="/servicios/peluqueria" element={<ServicioPeluqueria />} />
          <Route path="/servicios/maquillaje" element={<ServicioMaquillaje />} />
          <Route path="/servicios/spa" element={<ServicioSpa />} />
          <Route path="/servicios/depilacion" element={<ServicioDepilacion />} />

          {/* RUTA PRIVADA GENERAL: redirige al panel según el rol */}
          <Route
            path="/panelPrivado"
            element={<RutaPrivada><PanelPrivado /></RutaPrivada>}
          />

          {/* PANEL CLIENTE */}
          <Route
            path="/panelCliente"
            element={<RutaPrivada roles={["cliente"]}><PanelCliente /></RutaPrivada>}
          />

          {/* PANEL PERSONAL */}
          <Route
            path="/panelPersonal"
            element={<RutaPrivada roles={["personal"]}><PanelPersonal /></RutaPrivada>}
          />

          {/* PANEL ADMINISTRADOR */}
          <Route
            path="/panelAdministrador"
            element={<RutaPrivada roles={["administrador"]}><PanelAdministrador /></RutaPrivada>}
          />
          <Route
            path="/panelAdministrador/crearPersonal"
            element={<RutaPrivada roles={["administrador"]}><CrearPersonal /></RutaPrivada>}
          />
          <Route
            path="/panelAdministrador/clientes"
            element={<RutaPrivada roles={["administrador"]}><ListadoClientes /></RutaPrivada>}
          />
          <Route
            path="/panelAdministrador/personal"
            element={<RutaPrivada roles={["administrador"]}><ListadoPersonal /></RutaPrivada>}
          />

          <Route
            path="/panelAdministrador/servicios"
            element={<RutaPrivada roles={["administrador"]}><GestionServicios /></RutaPrivada>}
          />

          {/* CITAS: cualquier usuario con sesión (cada rol ve lo suyo)
              ARCHIVOS: solo personal y administrador */}
          <Route path="/citas" element={<RutaPrivada><ListadoCitas /></RutaPrivada>} />
          <Route
            path="/archivos"
            element={<RutaPrivada roles={["personal", "administrador"]}><GestionArchivos /></RutaPrivada>}
          />

          {/* PÁGINA NO ENCONTRADA */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />

        {/* Elementos disponibles en todas las páginas */}
        <AsistenteVirtual />
        <AvisoSesion />
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}
