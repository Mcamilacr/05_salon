import { Container, Row, Col } from "react-bootstrap";
import ModalIntegrante from "./ModalIntegrante";
import "../estilos/Footer.css";

import fotoIsabel from "../multimedia/imagenes/equipo/isabel.jpg";
import fotoCamila from "../multimedia/imagenes/equipo/camila.jpg";
import fotoNicolas from "../multimedia/imagenes/equipo/nicolas.jpg";

const integrantes = [
  { nombre: "Isabel Sofía García Joya", rol: "Product Owner / Development Team", correo: "isabel2240079@correo.uis.edu.co", foto: fotoIsabel },
  { nombre: "María Camila Cervera Rey", rol: "Scrum Master / Development Team", correo: "maria2240041@correo.uis.edu.co", foto: fotoCamila },
  { nombre: "Nicolas Alberto Arciniegas Rincón", rol: "Development Team", correo: "nicolas2240087@correo.uis.edu.co", foto: fotoNicolas },
];

export default function Footer() {
  return (
    <footer className="footer-personalizado text-light pt-5 pb-3 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>Salón de Belleza - SPA</h5>
            <p className="small">
              Transforma tu look, transforma tu vida.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Contáctanos</h5>
            <ul className="list-unstyled">
              {integrantes.map((integrante) => (
                <li key={integrante.correo} className="mb-1">
                  <ModalIntegrante integrante={integrante} />
                </li>
              ))}
            </ul>
          </Col>

          <Col md={4} className="mb-4">
            <h5>Síguenos</h5>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light me-3 fs-4">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light me-3 fs-4">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light fs-4">
              Instagram
            </a>
          </Col>
        </Row>

        <hr className="border-light" />
        <p className="text-center small mb-0">
          © 2026 Salón de Belleza - SPA. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
