import PaginaServicio from "../componentes/PaginaServicio";
import { servicios } from "../datos/servicios";

export default function ServicioDepilacion() {
  return <PaginaServicio servicio={servicios.depilacion} />;
}
