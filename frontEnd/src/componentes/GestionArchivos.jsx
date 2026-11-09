// Archivos: subir archivos al servidor (texto, imágenes, videos),
// descargarlos, buscarlos, modificar su descripción y eliminarlos.
// Disponible solo para el personal y el administrador.
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Alert, ProgressBar, Card } from "react-bootstrap";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { URL_API, encabezados } from "../datos/configuracionApi";

// Convierte bytes a un texto legible: 2048 -> "2.0 KB"
function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GestionArchivos() {
  const { token, usuario } = useAutenticacion();
  const [archivos, setArchivos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [archivoElegido, setArchivoElegido] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const campoArchivo = useRef(null);

  // Consultar la lista de archivos
  const consultar = useCallback(async (texto = "") => {
    try {
      const res = await axios.get(`${URL_API}/archivos`, { ...encabezados(token), params: { buscar: texto } });
      setArchivos(res.data.archivos);
    } catch {
      setMensaje("No se pudieron cargar los archivos");
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend
    consultar();
  }, [consultar]);

  // SUBIR: el archivo se envía como FormData (multipart/form-data),
  // que es el formato que recibe multer en el backend
  const subir = async (e) => {
    e.preventDefault();
    if (!archivoElegido) return;

    const datos = new FormData();
    datos.append("archivo", archivoElegido);
    datos.append("descripcion", descripcion);

    try {
      await axios.post(`${URL_API}/archivos`, datos, {
        ...encabezados(token),
        // Muestra el porcentaje de avance de la subida
        onUploadProgress: (evento) => {
          if (evento.total) setProgreso(Math.round((evento.loaded * 100) / evento.total));
        }
      });
      setMensaje("Archivo subido correctamente");
      setArchivoElegido(null);
      setDescripcion("");
      campoArchivo.current.value = "";
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al subir el archivo");
    } finally {
      setProgreso(0);
    }
  };

  // DESCARGAR: se pide el archivo como "blob" (datos binarios) porque la
  // ruta exige el token, y luego se simula un clic en un enlace temporal
  const descargar = async (archivo) => {
    try {
      const res = await axios.get(`${URL_API}/archivos/${archivo.id}/descargar`, {
        ...encabezados(token),
        responseType: "blob"
      });
      const url = URL.createObjectURL(res.data);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = archivo.nombre_original;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al descargar el archivo");
    }
  };

  // MODIFICAR la descripción
  const editarDescripcion = async (archivo) => {
    const nueva = window.prompt("Nueva descripción:", archivo.descripcion || "");
    if (nueva === null) return; // el usuario canceló
    try {
      await axios.put(`${URL_API}/archivos/${archivo.id}`, { descripcion: nueva }, encabezados(token));
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al modificar el archivo");
    }
  };

  // ELIMINAR
  const eliminar = async (archivo) => {
    if (!window.confirm(`¿Eliminar "${archivo.nombre_original}"?`)) return;
    try {
      await axios.delete(`${URL_API}/archivos/${archivo.id}`, encabezados(token));
      setMensaje("Archivo eliminado correctamente");
      consultar(buscar);
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al eliminar el archivo");
    }
  };

  // Solo el dueño o el administrador ven los botones de editar/eliminar
  const puedeModificar = (archivo) =>
    usuario.rol === "administrador" || archivo.usuario_id === usuario.id;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Archivos</h2>

      {mensaje && <Alert variant="info" dismissible onClose={() => setMensaje("")}>{mensaje}</Alert>}

      {/* Formulario de subida */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Subir archivo</Card.Title>
          <Form onSubmit={subir}>
            <Form.Group className="mb-2">
              <Form.Control
                type="file"
                ref={campoArchivo}
                accept="image/*,video/*,text/*,.pdf,.doc,.docx"
                onChange={(e) => setArchivoElegido(e.target.files[0] || null)}
                required
              />
              <Form.Text>Texto, imágenes, videos o documentos. Máximo 50 MB.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Descripción (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={255}
              />
            </Form.Group>
            {progreso > 0 && <ProgressBar now={progreso} label={`${progreso}%`} className="mb-2" />}
            <Button type="submit" variant="dark" disabled={!archivoElegido || progreso > 0}>
              Subir
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Búsqueda */}
      <Form className="d-flex gap-2 mb-3" onSubmit={(e) => { e.preventDefault(); consultar(buscar); }}>
        <Form.Control
          placeholder="Buscar por nombre o descripción"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ maxWidth: "320px" }}
        />
        <Button type="submit" variant="outline-dark">Buscar</Button>
      </Form>

      {/* Lista de archivos */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Tamaño</th>
              <th>Descripción</th>
              <th>Subido por</th>
              <th>Fecha</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre_original}</td>
                <td>{a.tipo}</td>
                <td>{formatearTamano(a.tamano)}</td>
                <td>{a.descripcion}</td>
                <td>{a.subido_por}</td>
                <td>{a.fecha_subida.slice(0, 10)}</td>
                <td className="text-nowrap">
                  <Button size="sm" variant="success" className="me-2" onClick={() => descargar(a)}>
                    Descargar
                  </Button>
                  {puedeModificar(a) && (
                    <>
                      <Button size="sm" className="me-2" onClick={() => editarDescripcion(a)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => eliminar(a)}>Eliminar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {archivos.length === 0 && <p>No hay archivos.</p>}
      </div>
    </Container>
  );
}
