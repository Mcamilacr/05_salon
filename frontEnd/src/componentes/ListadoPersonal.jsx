// Mantenimiento del personal (administrador): listar, buscar, modificar
// y eliminar. Para crear se usa CrearPersonal.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { URL_API, encabezados } from "../datos/configuracionApi";

export default function ListadoPersonal() {
  const { token } = useAutenticacion();
  const [personal, setPersonal] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [editando, setEditando] = useState(null); // empleado que se edita
  const [mensaje, setMensaje] = useState("");

  // Consultar el personal (con búsqueda opcional)
  const consultar = useCallback(async (texto = "") => {
    try {
      const res = await axios.get(`${URL_API}/admin/personal`, { ...encabezados(token), params: { buscar: texto } });
      setPersonal(res.data.personal);
    } catch {
      setMensaje("No se pudo consultar el personal");
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend
    consultar();
  }, [consultar]);

  const manejarCambio = (e) => {
    setEditando({ ...editando, [e.target.name]: e.target.value });
  };

  // Guardar los cambios del empleado
  const guardar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URL_API}/admin/personal/${editando.id}`, editando, encabezados(token));
      setMensaje("Empleado actualizado correctamente");
      setEditando(null);
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al actualizar el empleado");
    }
  };

  // Eliminar con confirmación
  const eliminar = async (empleado) => {
    if (!window.confirm(`¿Eliminar a ${empleado.nombre} ${empleado.apellidos}?`)) return;
    try {
      await axios.delete(`${URL_API}/admin/personal/${empleado.id}`, encabezados(token));
      setMensaje("Empleado eliminado correctamente");
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al eliminar el empleado");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Personal registrado</h2>

      {mensaje && <Alert variant="info" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { e.preventDefault(); consultar(buscar); }}>
        <Form.Control
          placeholder="Buscar por nombre, documento o correo"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ maxWidth: "320px" }}
        />
        <Button type="submit" variant="outline-dark">Buscar</Button>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Documento</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Cargo</th>
              <th>Creado por</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellidos}</td>
                <td>{empleado.documento}</td>
                <td>{empleado.correo}</td>
                <td>{empleado.telefono}</td>
                <td>{empleado.cargo}</td>
                <td>{empleado.creado_por}</td>
                <td className="text-nowrap">
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => setEditando({ ...empleado, telefono: empleado.telefono || "", cargo: empleado.cargo || "" })}
                  >
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => eliminar(empleado)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {personal.length === 0 && <p>No hay personal registrado.</p>}
      </div>

      {/* Modal de edición */}
      <Modal show={!!editando} onHide={() => setEditando(null)} centered>
        {editando && (
          <Form onSubmit={guardar}>
            <Modal.Header closeButton>
              <Modal.Title>Editar empleado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {[
                ["nombre", "Nombre", true],
                ["apellidos", "Apellidos", true],
                ["documento", "Documento", true],
                ["correo", "Correo electrónico", true],
                ["telefono", "Teléfono", false],
                ["cargo", "Cargo", false]
              ].map(([campo, etiqueta, obligatorio]) => (
                <Form.Group className="mb-2" key={campo}>
                  <Form.Label>{etiqueta}</Form.Label>
                  <Form.Control
                    type={campo === "correo" ? "email" : "text"}
                    name={campo}
                    value={editando[campo]}
                    onChange={manejarCambio}
                    required={obligatorio}
                  />
                </Form.Group>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setEditando(null)}>Cancelar</Button>
              <Button type="submit" variant="dark">Guardar</Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </Container>
  );
}
