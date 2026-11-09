// Rutas de citas. Prefijo en servidor.js: /api/citas
// Todas requieren login; el controlador decide qué puede hacer cada rol.

const express = require("express");
const { verificarToken, permitirRoles } = require("../intermediarios/autenticacion");
const controlador = require("../controladores/citaControlador");

const router = express.Router();

router.use(verificarToken);

router.get("/empleados", controlador.listarEmpleados); // personal para formularios
router.get("/", controlador.listarCitas); // listar / buscar
router.post("/", permitirRoles("cliente", "administrador"), controlador.crearCita); // agendar
router.put("/:id", controlador.actualizarCita); // modificar / cancelar
router.delete("/:id", permitirRoles("administrador"), controlador.eliminarCita); // eliminar

module.exports = router;
