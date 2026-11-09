// Rutas del asistente virtual con IA. Prefijo en servidor.js: /api/asistente
// Es público: lo pueden usar visitantes y usuarios registrados.

const express = require("express");
const { consultarAsistente } = require("../controladores/asistenteControlador");

const router = express.Router();

router.post("/", consultarAsistente); // POST /api/asistente

module.exports = router;
