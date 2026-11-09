// Rutas (router) de autenticación. Solo asocian cada URL con su
// función del controlador. Prefijo en servidor.js: /api/auth

const express = require("express");
const { registro, login } = require("../controladores/autenticacionControlador");

const router = express.Router();

router.post("/registro", registro); // POST /api/auth/registro
router.post("/login", login); // POST /api/auth/login

module.exports = router;
