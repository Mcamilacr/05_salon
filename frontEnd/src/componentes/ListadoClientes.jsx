// Mantenimiento de clientes (listar, modificar y eliminar) para el administrador.
// Basado en ListadoTotal.jsx (ejemplo del profesor adaptado por el equipo).
// Los modales usan los atributos data-bs-* de Bootstrap, por eso main.jsx
// importa bootstrap.bundle.min.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";
import { URL_API } from "../datos/configuracionApi";

function ListadoClientes() {

  // Token de la sesión: el backend lo exige para estas rutas
  const { token } = useAutenticacion();

  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [buscar, setBuscar] = useState("");

  const API = `${URL_API}/admin/clientes`;

  // Encabezado con el token que se envía en cada petición
  const configuracion = { headers: { Authorization: `Bearer ${token}` } };

  // CONSULTAR TODOS LOS CLIENTES
  // (texto: búsqueda opcional por nombre, apellidos, documento o correo)
  const getClientes = useCallback(async (texto = "") => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
        params: { buscar: texto }
      });
      setClientes(res.data.clientes);
    } catch (error) {
      console.error("Error al consultar clientes:", error);
      alert("Error al cargar los clientes");
    }
  }, [API, token]);

  // CARGAR DATOS PARA EDITAR
  const handleModalEdit = (element) => {
    setIdCliente(element.id);
    setNombre(element.nombre);
    setApellidos(element.apellidos);
    setDocumento(element.documento);
    setCorreo(element.correo);
  };

  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {
    setNombre("");
    setApellidos("");
    setDocumento("");
    setCorreo("");
    setIdCliente("");
  };

  // ACTUALIZAR CLIENTE
  const handleUpdate = async () => {

    const updateCliente = {
      nombre,
      apellidos,
      documento,
      correo
    };

    try {
      const res = await axios.put(
        `${API}/${idCliente}`,
        updateCliente,
        configuracion
      );

      if (res.status === 200) {
        alert("Cliente actualizado correctamente");
        limpiarFormulario();
        getClientes(buscar);
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.mensaje || "Error al actualizar el cliente");
    }
  };

  // SELECCIONAR CLIENTE PARA ELIMINAR
  const handleIdCliente = (element) => {
    setIdCliente(element.id);
  };

  // ELIMINAR CLIENTE
  const deleteElement = async () => {
    try {
      const res = await axios.delete(
        `${API}/${idCliente}`,
        configuracion
      );

      if (res.status === 200) {
        alert("Cliente eliminado correctamente");
        setIdCliente("");
        getClientes(buscar);
      }

    } catch (error) {
      console.error(error);
      alert("Error al eliminar el cliente");
    }
  };

  // CONSULTAR AL INICIAR LA PAGINA
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos desde el backend
    getClientes();
  }, [getClientes]);

  return (
    <div className="container my-5">

      <h2 className="text-center mb-4">
        LISTADO TOTAL DE CLIENTES
      </h2>

      {/* BÚSQUEDA */}
      <form
        className="d-flex gap-2 mb-3"
        onSubmit={(e) => { e.preventDefault(); getClientes(buscar); }}
      >
        <input
          className="form-control"
          style={{ maxWidth: "320px" }}
          placeholder="Buscar por nombre, documento o correo"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <button type="submit" className="btn btn-outline-dark">Buscar</button>
      </form>

      {clientes.length === 0 ? (

        <div className="text-center mt-5">
          <h4>No hay clientes registrados</h4>
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-striped table-hover table-bordered">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Fecha registro</th>
                <th>Opciones</th>
              </tr>
            </thead>

            <tbody>

              {clientes.map((element) => (

                <tr key={element.id}>

                  <td>{element.id}</td>
                  <td>{element.nombre}</td>
                  <td>{element.apellidos}</td>
                  <td>{element.documento}</td>
                  <td>{element.correo}</td>
                  <td>{new Date(element.fecha_registro).toLocaleDateString()}</td>

                  <td>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEditar"
                      onClick={() => handleModalEdit(element)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEliminar"
                      onClick={() => handleIdCliente(element)}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* MODAL EDITAR */}

      <div
        className="modal fade"
        id="modalEditar"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">
                Editar cliente
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              <form>

                <label>Nombre:</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />

                <label>Apellidos:</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />

                <label>Documento:</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />

                <label>Correo electrónico:</label>
                <input
                  type="email"
                  className="form-control mb-2"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />

              </form>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={limpiarFormulario}
              >
                Cerrar
              </button>

              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleUpdate}
              >
                Actualizar
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL ELIMINAR */}

      <div
        className="modal fade"
        id="modalEliminar"
        tabIndex="-1"
        aria-hidden="true"
      >

        <div className="modal-dialog">

          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">
                Confirmar eliminación
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              ¿Está seguro de que desea eliminar este cliente?

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={deleteElement}
              >
                Eliminar
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ListadoClientes;