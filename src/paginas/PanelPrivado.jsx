// Ruta privada solo con login
import { Container, Alert } from "react-bootstrap";

export default function PanelPrivado() {
  return (
    <Container className="my-5 pt-5">
      <Alert variant="success">
        Bienvenido/a. Has ingresado correctamente a tu panel privado.
      </Alert>
      <h2>Mi panel</h2>
      <p>
        Aquí irán, en fases posteriores, el horario de citas agendadas,
        el historial y las opciones de cuenta.
      </p>
    </Container>
  );
}
