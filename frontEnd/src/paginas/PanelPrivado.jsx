// Ruta privada general (/panelPrivado): envía a cada usuario a su panel
// según el rol con el que inició sesión
import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { obtenerRutaPanel } from "../datos/configuracionApi";

export default function PanelPrivado() {
  const { usuario } = useAutenticacion();
  return <Navigate to={obtenerRutaPanel(usuario?.rol)} replace />;
}
