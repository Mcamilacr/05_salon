// Aviso que aparece cuando la sesión se cerró por inactividad
import { Modal, Button } from "react-bootstrap";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { TIEMPO_INACTIVIDAD_MS } from "../datos/configuracionApi";

export default function AvisoSesion() {
  const { sesionExpirada, cerrarAvisoSesion } = useAutenticacion();
  const segundos = Math.round(TIEMPO_INACTIVIDAD_MS / 1000);

  return (
    <Modal show={sesionExpirada} onHide={cerrarAvisoSesion} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sesión cerrada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Tu sesión se cerró automáticamente después de {segundos} segundos sin actividad.
        Vuelve a iniciar sesión para continuar.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={cerrarAvisoSesion}>Entendido</Button>
      </Modal.Footer>
    </Modal>
  );
}
