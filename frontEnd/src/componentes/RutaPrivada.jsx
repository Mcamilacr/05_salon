// Protege las rutas privadas: si el usuario no inició sesión, o su rol no
// tiene permiso, redirige al inicio ("/") sin mostrar el contenido
import { Navigate, Outlet } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

export default function RutaPrivada({ roles, children }) {
  const { usuario, autenticado } = useAutenticacion();

  // Verificar si el usuario inició sesión
  if (!autenticado || !usuario) {
    return <Navigate to="/" replace />;
  }

  // Verificar si tiene permiso según su rol
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  // Mostrar la página autorizada
  return children ? children : <Outlet />;
}
