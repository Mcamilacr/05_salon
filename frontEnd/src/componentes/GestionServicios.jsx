// Mantenimiento de servicios (administrador): listar, buscar, crear,
// modificar y eliminar registros de la tabla "servicios"
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { URL_API, encabezados, formatearPrecio, CATEGORIAS } from "../datos/configuracionApi";

// Formulario vacío
const SERVICIO_VACIO = {
  id: null,
  categoria: "manicura",
  nombre: "",
  descripcion: "",
  precio_min: "",
  precio_max: "",
  duracion_minutos: 60
};

export default function GestionServicios() {
  const { token } = useAutenticacion();
  const [servicios, setServicios] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [formulario, setFormulario] = useState(SERVICIO_VACIO);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Consultar servicios (con texto de búsqueda opcional)
  const consultar = useCallback(async (texto = "") => {
    try {
      const res = await axios.get(`${URL_API}/servicios`, { params: { buscar: texto } });
      setServicios(res.data.servicios);
    } catch {
      setMensaje("No se pudieron cargar los servicios");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend
    consultar();
  }, [consultar]);

  // Abrir el modal vacío (crear) o con los datos de un servicio (editar)
  const abrirModal = (servicio = SERVICIO_VACIO) => {
    setFormulario({ ...servicio, descripcion: servicio.descripcion || "" });
    setMostrarModal(true);
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Guardar: POST si es nuevo, PUT si ya tiene id
  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (formulario.id) {
        await axios.put(`${URL_API}/servicios/${formulario.id}`, formulario, encabezados(token));
        setMensaje("Servicio actualizado correctamente");
      } else {
        await axios.post(`${URL_API}/servicios`, formulario, encabezados(token));
        setMensaje("Servicio creado correctamente");
      }
      setMostrarModal(false);
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al guardar el servicio");
    }
  };

  // Eliminar con confirmación
  const eliminar = async (servicio) => {
    if (!window.confirm(`¿Eliminar el servicio "${servicio.nombre}"? También se borrarán sus citas.`)) return;
    try {
      await axios.delete(`${URL_API}/servicios/${servicio.id}`, encabezados(token));
      setMensaje("Servicio eliminado correctamente");
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al eliminar el servicio");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Gestión de servicios</h2>

      {mensaje && <Alert variant="info" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      {/* Búsqueda y botón de crear */}
      <Form
        className="d-flex gap-2 mb-3 flex-wrap"
        onSubmit={(e) => { e.preventDefault(); consultar(buscar); }}
      >
        <Form.Control
          placeholder="Buscar por nombre o descripción"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ maxWidth: "320px" }}
        />
        <Button type="submit" variant="outline-dark">Buscar</Button>
        <Button variant="success" className="ms-auto" onClick={() => abrirModal()}>
          + Nuevo servicio
        </Button>
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{CATEGORIAS[s.categoria]}</td>
                <td>{s.nombre}</td>
                <td>{s.descripcion}</td>
                <td>{formatearPrecio(s.precio_min)} - {formatearPrecio(s.precio_max)}</td>
                <td>{s.duracion_minutos} min</td>
                <td className="text-nowrap">
                  <Button size="sm" className="me-2" onClick={() => abrirModal(s)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => eliminar(s)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {servicios.length === 0 && <p>No se encontraron servicios.</p>}
      </div>

      {/* Modal para crear o editar */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{formulario.id ? "Editar servicio" : "Nuevo servicio"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
                {Object.entries(CATEGORIAS).map(([clave, nombre]) => (
                  <option key={clave} value={clave}>{nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={formulario.nombre} onChange={manejarCambio} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={formulario.descripcion} onChange={manejarCambio} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Precio mínimo</Form.Label>
                  <Form.Control type="number" min="0" name="precio_min" value={formulario.precio_min} onChange={manejarCambio} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Precio máximo</Form.Label>
                  <Form.Control type="number" min="0" name="precio_max" value={formulario.precio_max} onChange={manejarCambio} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Duración (minutos)</Form.Label>
              <Form.Control type="number" min="5" name="duracion_minutos" value={formulario.duracion_minutos} onChange={manejarCambio} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
            <Button type="submit" variant="dark">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
