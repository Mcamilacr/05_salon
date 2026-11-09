// Rutas (router) del administrador. Prefijo en servidor.js: /api/admin
// Todas exigen token válido Y rol "administrador".

const express = require("express");
const { verificarToken, permitirRoles } = require("../intermediarios/autenticacion");
const controlador = require("../controladores/administradorControlador");

const router = express.Router();

// Protección para todas las rutas de este archivo
router.use(verificarToken);
router.use(permitirRoles("administrador"));

// Personal
router.post("/personal", controlador.crearPersonal); // crear
router.get("/personal", controlador.listarPersonal); // listar o buscar
router.put("/personal/:id", controlador.actualizarPersonal); // modificar
router.delete("/personal/:id", controlador.eliminarPersonal); // eliminar

// Clientes
router.get("/clientes", controlador.listarClientes); // listar o buscar
router.put("/clientes/:id", controlador.actualizarCliente); // modificar
router.delete("/clientes/:id", controlador.eliminarCliente); // eliminar

module.exports = router;
