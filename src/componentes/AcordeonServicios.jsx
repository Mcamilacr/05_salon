import { Accordion, OverlayTrigger, Popover, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../estilos/Acordeon.css";

const servicios = [
  { id: "manicura", titulo: "Manicura y pedicura", descripcion: "Cuidado de uñas, limpieza, corte y esmaltado.", precio: "$15.000 - $150.000" },
  { id: "peluqueria", titulo: "Peluquería", descripcion: "Corte, peinado y tratamientos capilares.", precio: "$10.000 - $700.000" },
  { id: "maquillaje", titulo: "Maquillaje", descripcion: "Maquillaje social y para eventos especiales.", precio: "$50.000 - $300.000" },
  { id: "spa", titulo: "Spa", descripcion: "Masajes, faciales y tratamientos de relajación.", precio: "$50.000 - $150.000" },
  { id: "depilacion", titulo: "Depilación", descripcion: "Depilación facial y corporal con distintos métodos.", precio: "$15.000 - $150.000" },
];

export default function AcordeonServicios() {
  return (
    <Accordion defaultActiveKey="0" id="servicios">
      {servicios.map((servicio, indice) => (
        <Accordion.Item eventKey={String(indice)} key={servicio.id}>
          <Accordion.Header>{servicio.titulo}</Accordion.Header>
          <Accordion.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>{servicio.descripcion}</span>

            <span className="d-flex gap-2">
              {/* Popover con el rango de precios */}
              <OverlayTrigger
                trigger="click"
                placement="top"
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Precio aproximado</Popover.Header>
                    <Popover.Body>{servicio.precio}</Popover.Body>
                  </Popover>
                }
              >
                <Button variant="outline-dark" size="sm">Ver precio</Button>
              </OverlayTrigger>

              <Button as={Link} to={`/servicios/${servicio.id}`} variant="dark" size="sm">
                Ver más
              </Button>
            </span>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
