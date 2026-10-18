import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProveedorAutenticacion } from "./contexto/ContextoAutenticacion";
import NavBar from "./componentes/NavBar";
import Footer from "./componentes/Footer";
import RutaPrivada from "./componentes/RutaPrivada";

import Home from "./paginas/Home";
import Contacto from "./paginas/Contacto";
import PanelPrivado from "./paginas/PanelPrivado";
import NotFound from "./paginas/NotFound";
import ServicioManicura from "./paginas/ServicioManicura";
import ServicioPeluqueria from "./paginas/ServicioPeluqueria";
import ServicioMaquillaje from "./paginas/ServicioMaquillaje";
import ServicioSpa from "./paginas/ServicioSpa";
import ServicioDepilacion from "./paginas/ServicioDepilacion";

import "./estilos/App.css";

export default function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <NavBar />

        <Routes>          
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/servicios/manicura" element={<ServicioManicura />} />
          <Route path="/servicios/peluqueria" element={<ServicioPeluqueria />} />
          <Route path="/servicios/maquillaje" element={<ServicioMaquillaje />} />
          <Route path="/servicios/spa" element={<ServicioSpa />} />
          <Route path="/servicios/depilacion" element={<ServicioDepilacion />} />
          
          <Route
            path="/panelPrivado"
            element={
              <RutaPrivada>
                <PanelPrivado />
              </RutaPrivada>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ProveedorAutenticacion>
  );
}
