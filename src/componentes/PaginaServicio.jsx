// página de cada servicio
// botón "Agenda tu cita" (lleva a una ruta privada, pide login)

import { Container, Row, Col, Table, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../estilos/PaginaServicio.css";

export default function PaginaServicio({ servicio }) {
  return (
    <Container className="my-4 pt-4">
      <Link to="/" className="servicio-volver">← Volver al inicio</Link>

      <h2 className="servicio-titulo mt-2">{servicio.titulo}</h2>

      <Image src={servicio.imagen} alt={servicio.titulo} fluid className="servicio-banner mb-4" />

      <Row className="g-4">
        <Col xs={12} md={5}>
          {servicio.parrafos.map((parrafo, indice) => (
            <p key={indice} className="servicio-texto">{parrafo}</p>
          ))}
          <div className="text-center mt-4">
            <Button as={Link} to="/panelPrivado" className="servicio-boton">
              AGENDA TU CITA
            </Button>
          </div>
        </Col>

        <Col xs={12} md={7}>
          <Table bordered responsive className="servicio-tabla">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Precio Aproximado (COP)</th>
              </tr>
            </thead>
            <tbody>
              {servicio.tabla.map((fila) => (
                <tr key={fila[0]}>
                  <td>{fila[0]}</td>
                  <td>{fila[1]}</td>
                  <td>{fila[2]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
