import PaginaServicio from "../componentes/PaginaServicio";
import { servicios } from "../datos/servicios";

export default function ServicioMaquillaje() {
  return <PaginaServicio servicio={servicios.maquillaje} />;
}
