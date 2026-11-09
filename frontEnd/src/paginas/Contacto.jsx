import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Container, Button, Alert } from "react-bootstrap";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [formulario, setFormulario] = useState({ nombre: "", correo: "", mensaje: "" });

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    // En esta fase no hay backend: solo se simula el envío.
    setEnviado(true);
  };

  return (
    <Container className="my-5 pt-5" style={{ maxWidth: "600px" }}>
      <h2>Contáctenos</h2>

      {enviado && <Alert variant="success">¡Gracias! Tu mensaje fue enviado (simulado).</Alert>}

      <Form onSubmit={manejarEnvio}>
        <Form.Group className="mb-3" controlId="contactoNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Tu nombre"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactoCorreo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correo"
            value={formulario.correo}
            onChange={manejarCambio}
            placeholder="nombre@correo.com"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactoMensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            value={formulario.mensaje}
            onChange={manejarCambio}
            required
          />
        </Form.Group>

        <Button variant="dark" type="submit">Enviar</Button>
      </Form>
    </Container>
  );
}
