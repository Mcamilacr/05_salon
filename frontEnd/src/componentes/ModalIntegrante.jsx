// Modal con la info básica y foto de cada integrante

import { useState } from "react";
import { Modal, Button, Image } from "react-bootstrap";

export default function ModalIntegrante({ integrante }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <Button variant="link" className="text-light p-0" onClick={() => setMostrar(true)}>
        {integrante.nombre}
      </Button>

      <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{integrante.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={integrante.foto} roundedCircle width={120} height={120} className="mb-3" />
          <p><strong>Rol en el proyecto:</strong> {integrante.rol}</p>
          <p><strong>Correo:</strong> {integrante.correo}</p>
          <p><strong>Programa:</strong> Ingeniería de Sistemas - UIS</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
