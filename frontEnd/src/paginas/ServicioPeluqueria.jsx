import PaginaServicio from "../componentes/PaginaServicio";
import { servicios } from "../datos/servicios";

export default function ServicioPeluqueria() {
  return <PaginaServicio servicio={servicios.peluqueria} />;
}
