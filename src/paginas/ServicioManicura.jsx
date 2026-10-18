import PaginaServicio from "../componentes/PaginaServicio";
import { servicios } from "../datos/servicios";

export default function ServicioManicura() {
  return <PaginaServicio servicio={servicios.manicura} />;
}
