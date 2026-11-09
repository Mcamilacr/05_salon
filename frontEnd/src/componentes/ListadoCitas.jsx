// Citas: una sola pantalla para los tres roles. Lo que se muestra y las
// acciones disponibles dependen del rol del usuario que inició sesión:
//   - cliente:       ve sus citas, agenda nuevas y cancela
//   - personal:      ve las citas asignadas y cambia su estado
//   - administrador: ve todas, crea, edita y elimina
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Table, Button, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { URL_API, encabezados, CATEGORIAS } from "../datos/configuracionApi";

// Color de la etiqueta de cada estado
const COLOR_ESTADO = {
  pendiente: "warning",
  confirmada: "primary",
  completada: "success",
  cancelada: "secondary"
};

const CITA_VACIA = {
  id: null,
  cliente_id: "",
  servicio_id: "",
  empleado_id: "",
  fecha: "",
  hora: "",
  estado: "pendiente",
  observaciones: ""
};

export default function ListadoCitas() {
  const { token, usuario } = useAutenticacion();
  const rol = usuario.rol;
  const esAdmin = rol === "administrador";

  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [formulario, setFormulario] = useState(CITA_VACIA);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Consultar citas (el backend filtra según el rol)
  const consultar = useCallback(async (texto = "") => {
    try {
      const res = await axios.get(`${URL_API}/citas`, { ...encabezados(token), params: { buscar: texto } });
      setCitas(res.data.citas);
    } catch {
      setMensaje("No se pudieron cargar las citas");
    }
  }, [token]);

  // Al abrir la página: citas y listas para los formularios
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend
    consultar();

    if (rol === "personal") return;

    axios.get(`${URL_API}/servicios`).then((res) => setServicios(res.data.servicios)).catch(() => {});
    axios.get(`${URL_API}/citas/empleados`, encabezados(token))
      .then((res) => setEmpleados(res.data.empleados)).catch(() => {});

    if (rol === "administrador") {
      axios.get(`${URL_API}/admin/clientes`, encabezados(token))
        .then((res) => setClientes(res.data.clientes)).catch(() => {});
    }
  }, [consultar, rol, token]);

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Abrir el modal vacío (agendar) o con los datos de una cita (editar)
  const abrirModal = (cita = CITA_VACIA) => {
    setFormulario({
      ...cita,
      hora: cita.hora ? cita.hora.slice(0, 5) : "",
      empleado_id: cita.empleado_id || "",
      observaciones: cita.observaciones || ""
    });
    setMostrarModal(true);
  };

  // Guardar: POST si es nueva, PUT si ya tiene id (solo admin edita todo)
  const guardar = async (e) => {
    e.preventDefault();
    try {
      if (formulario.id) {
        await axios.put(`${URL_API}/citas/${formulario.id}`, formulario, encabezados(token));
        setMensaje("Cita actualizada correctamente");
      } else {
        await axios.post(`${URL_API}/citas`, formulario, encabezados(token));
        setMensaje("Cita agendada correctamente");
      }
      setMostrarModal(false);
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al guardar la cita");
    }
  };

  // Cliente: cancelar su cita
  const cancelar = async (cita) => {
    if (!window.confirm("¿Cancelar esta cita?")) return;
    try {
      await axios.put(`${URL_API}/citas/${cita.id}`, {}, encabezados(token));
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al cancelar la cita");
    }
  };

  // Personal: cambiar el estado desde la tabla
  const cambiarEstado = async (cita, estado) => {
    try {
      await axios.put(`${URL_API}/citas/${cita.id}`, { estado }, encabezados(token));
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al cambiar el estado");
    }
  };

  // Administrador: eliminar
  const eliminar = async (cita) => {
    if (!window.confirm("¿Eliminar definitivamente esta cita?")) return;
    try {
      await axios.delete(`${URL_API}/citas/${cita.id}`, encabezados(token));
      setMensaje("Cita eliminada correctamente");
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al eliminar la cita");
    }
  };

  // Título según el rol
  const titulo = { cliente: "Mis citas", personal: "Citas asignadas", administrador: "Gestión de citas" }[rol];

  // Fecha mínima para agendar: hoy
  const hoy = new Date().toLocaleDateString("en-CA");

  return (
    <Container className="my-5">
      <h2 className="mb-4">{titulo}</h2>

      {mensaje && <Alert variant="info" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      <Form
        className="d-flex gap-2 mb-3 flex-wrap"
        onSubmit={(e) => { e.preventDefault(); consultar(buscar); }}
      >
        <Form.Control
          placeholder="Buscar por cliente, servicio o estado"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ maxWidth: "320px" }}
        />
        <Button type="submit" variant="outline-dark">Buscar</Button>
        {rol !== "personal" && (
          <Button variant="success" className="ms-auto" onClick={() => abrirModal()}>
            + Agendar cita
          </Button>
        )}
      </Form>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              {rol !== "cliente" && <th>Cliente</th>}
              <th>Servicio</th>
              {rol !== "personal" && <th>Atiende</th>}
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td>{c.fecha}</td>
                <td>{c.hora.slice(0, 5)}</td>
                {rol !== "cliente" && <td>{c.cliente}</td>}
                <td>{c.servicio}</td>
                {rol !== "personal" && <td>{c.empleado || "Por asignar"}</td>}
                <td><Badge bg={COLOR_ESTADO[c.estado]}>{c.estado}</Badge></td>
                <td>{c.observaciones}</td>
                <td className="text-nowrap">
                  {/* Opciones del cliente */}
                  {rol === "cliente" && c.estado === "pendiente" && (
                    <Button size="sm" variant="outline-danger" onClick={() => cancelar(c)}>Cancelar</Button>
                  )}

                  {/* Opciones del personal */}
                  {rol === "personal" && (
                    <Form.Select
                      size="sm"
                      value={c.estado}
                      onChange={(e) => cambiarEstado(c, e.target.value)}
                    >
                      {Object.keys(COLOR_ESTADO).map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </Form.Select>
                  )}

                  {/* Opciones del administrador */}
                  {esAdmin && (
                    <>
                      <Button size="sm" className="me-2" onClick={() => abrirModal(c)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => eliminar(c)}>Eliminar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {citas.length === 0 && <p>No hay citas para mostrar.</p>}
      </div>

      {/* Modal para agendar (cliente/admin) o editar (admin) */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{formulario.id ? "Editar cita" : "Agendar cita"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Solo el administrador elige el cliente al crear */}
            {esAdmin && !formulario.id && (
              <Form.Group className="mb-2">
                <Form.Label>Cliente</Form.Label>
                <Form.Select name="cliente_id" value={formulario.cliente_id} onChange={manejarCambio} required>
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cl) => (
                    <option key={cl.id} value={cl.id}>{cl.nombre} {cl.apellidos}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Servicio</Form.Label>
              <Form.Select name="servicio_id" value={formulario.servicio_id} onChange={manejarCambio} required>
                <option value="">Selecciona un servicio</option>
                {Object.entries(CATEGORIAS).map(([clave, nombre]) => (
                  <optgroup key={clave} label={nombre}>
                    {servicios.filter((s) => s.categoria === clave).map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Profesional (opcional)</Form.Label>
              <Form.Select name="empleado_id" value={formulario.empleado_id} onChange={manejarCambio}>
                <option value="">Sin preferencia</option>
                {empleados.map((em) => (
                  <option key={em.id} value={em.id}>{em.nombre}{em.cargo ? ` - ${em.cargo}` : ""}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    min={formulario.id ? undefined : hoy}
                    value={formulario.fecha}
                    onChange={manejarCambio}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora"
                    min="08:00"
                    max="19:00"
                    value={formulario.hora}
                    onChange={manejarCambio}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* El estado solo lo cambia el administrador al editar */}
            {esAdmin && formulario.id && (
              <Form.Group className="mb-2">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estado" value={formulario.estado} onChange={manejarCambio}>
                  {Object.keys(COLOR_ESTADO).map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group>
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                maxLength={255}
              />
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
