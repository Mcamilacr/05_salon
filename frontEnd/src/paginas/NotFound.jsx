import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container className="my-5 pt-5 text-center">
      <h2>404 - Página no encontrada</h2>
      <Link to="/">Volver al inicio</Link>
    </Container>
  );
}
