// Rutas de archivos. Prefijo en servidor.js: /api/archivos
// Solo para quienes trabajan en el salón: personal y administrador.

const express = require("express");
const { verificarToken, permitirRoles } = require("../intermediarios/autenticacion");
const { recibirArchivo } = require("../intermediarios/subidaArchivos");
const controlador = require("../controladores/archivoControlador");

const router = express.Router();

router.use(verificarToken);
router.use(permitirRoles("personal", "administrador"));

router.get("/", controlador.listarArchivos); // listar / buscar
router.post("/", recibirArchivo, controlador.subirArchivo); // subir (cliente -> servidor)
router.get("/:id/descargar", controlador.descargarArchivo); // descargar (servidor -> cliente)
router.put("/:id", controlador.actualizarArchivo); // modificar descripción
router.delete("/:id", controlador.eliminarArchivo); // eliminar

module.exports = router;
