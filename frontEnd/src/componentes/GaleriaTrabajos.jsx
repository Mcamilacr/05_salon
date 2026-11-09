// Galería de trabajos realizados: 3 imágenes servidas por el backend desde
// la carpeta pública (express.static). Las imágenes NO están en el frontEnd:
// se piden al servidor en http://localhost:3000/imagenes/...
import { Row, Col, Card } from "react-bootstrap";
import { URL_SERVIDOR } from "../datos/configuracionApi";

// Cambiar los títulos según las fotos que se pongan en
// backEnd/publico/imagenes (ver Readme.txt, paso 2B)
const IMAGENES = [
  { archivo: "trabajo1.jpg", titulo: "Diseño de uñas" },
  { archivo: "trabajo2.jpg", titulo: "Peinado" },
  { archivo: "trabajo3.jpg", titulo: "Maquillaje" }
];

export default function GaleriaTrabajos() {
  return (
    <section className="my-5">
      <h3 className="mb-3">Trabajos realizados</h3>
      <Row className="g-3">
        {IMAGENES.map((imagen) => (
          <Col xs={12} md={4} key={imagen.archivo}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={`${URL_SERVIDOR}/imagenes/${imagen.archivo}`}
                alt={imagen.titulo}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Text>{imagen.titulo}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
