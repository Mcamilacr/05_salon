// Panel privado del personal del salón: sus citas asignadas y archivos
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

export default function PanelPersonal() {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <div className="container my-5">
      <h2>Panel del personal</h2>
      <h4>Bienvenido, {usuario.nombre} {usuario.apellidos}</h4>
      <p>Has iniciado sesión como personal del salón.</p>

      <div className="d-grid gap-3">
        <Link to="/citas" className="btn btn-primary">Mis citas asignadas</Link>
        <Link to="/archivos" className="btn btn-primary">Archivos (portafolio de trabajos)</Link>
        <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </div>
  );
}
