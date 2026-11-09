// Rutas de servicios. Prefijo en servidor.js: /api/servicios
// Listar es público; crear, modificar y eliminar requiere administrador.

const express = require("express");
const { verificarToken, permitirRoles } = require("../intermediarios/autenticacion");
const controlador = require("../controladores/servicioControlador");

const router = express.Router();
const soloAdministrador = [verificarToken, permitirRoles("administrador")];

router.get("/", controlador.listarServicios); // listar o buscar
router.post("/", soloAdministrador, controlador.crearServicio); // crear
router.put("/:id", soloAdministrador, controlador.actualizarServicio); // modificar
router.delete("/:id", soloAdministrador, controlador.eliminarServicio); // eliminar

module.exports = router;
