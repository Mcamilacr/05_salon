// Protege rutas privadas si el usuario no está autenticado
// redirige a la ruta pública de inicio ("/") sin mostrar el contenido

import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

export default function RutaPrivada({ children }) {
  const { estaAutenticado } = useAutenticacion();

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return children;
}
