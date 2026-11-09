// Panel principal del administrador: accesos al mantenimiento de todas
// las tablas (usuarios, servicios, citas y archivos)
import { Link } from "react-router-dom";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

export default function PanelAdministrador() {
  const { usuario, cerrarSesion } = useAutenticacion();

  return (
    <div className="container my-5">
      <h2>Panel del administrador</h2>
      <p>Bienvenido, {usuario.nombre} {usuario.apellidos}</p>

      <div className="d-grid gap-3">
        <Link to="/panelAdministrador/crearPersonal" className="btn btn-success">Crear personal</Link>
        <Link to="/panelAdministrador/personal" className="btn btn-primary">Gestionar personal</Link>
        <Link to="/panelAdministrador/clientes" className="btn btn-primary">Gestionar clientes</Link>
        <Link to="/panelAdministrador/servicios" className="btn btn-primary">Gestionar servicios</Link>
        <Link to="/citas" className="btn btn-primary">Gestionar citas</Link>
        <Link to="/archivos" className="btn btn-primary">Archivos</Link>
        <button className="btn btn-danger" onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
    </div>
  );
}
