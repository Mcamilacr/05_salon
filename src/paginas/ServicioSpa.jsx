import PaginaServicio from "../componentes/PaginaServicio";
import { servicios } from "../datos/servicios";

export default function ServicioSpa() {
  return <PaginaServicio servicio={servicios.spa} />;
}
