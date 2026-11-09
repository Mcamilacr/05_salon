// Panel privado del cliente: acceso a sus citas
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

export default function PanelCliente() {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <div className="container my-5">
      <h2>Mi cuenta</h2>
      <h4>Bienvenido, {usuario.nombre} {usuario.apellidos}</h4>
      <p>Correo: {usuario.correo}</p>
      <p>Gracias por visitar nuestro salón de belleza.</p>

      <div className="d-grid gap-3">
        <Link to="/citas" className="btn btn-primary">Mis citas / agendar cita</Link>
        <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </div>
  );
}
