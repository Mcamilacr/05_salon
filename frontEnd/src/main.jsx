// Punto de entrada del frontEnd: monta la aplicación en el <div id="root">
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Estilos de Bootstrap y su JavaScript (necesario para los modales
// que usan data-bs-toggle, como en ListadoClientes)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.jsx";

// El ProveedorAutenticacion ya está dentro de App, no se repite aquí
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
