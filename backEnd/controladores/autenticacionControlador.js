// Controlador de autenticación: registro de clientes y login.
// Contiene la lógica; las URL se definen en rutas/autenticacionRutas.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../configuracion/baseDatos");

// POST /api/auth/registro -> registra un cliente nuevo
async function registro(req, res) {

    try {
        const { nombre, apellidos, documento, correo, contrasena } = req.body;

        // Validaciones básicas
        if (!nombre || !apellidos || !documento || !correo || !contrasena) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        if (contrasena.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        // El correo y el documento no se pueden repetir
        const [existente] = await pool.execute(
            "SELECT id FROM usuarios WHERE correo = ? OR documento = ?",
            [correo, documento]
        );

        if (existente.length > 0) {
            return res.status(409).json({
                mensaje: "El correo o documento ya está registrado"
            });
        }

        // La contraseña se guarda cifrada, nunca en texto plano
        const hash = await bcrypt.hash(contrasena, 12);

        await pool.execute(
            `INSERT INTO usuarios (nombre, apellidos, documento, correo, contrasena, rol)
             VALUES (?, ?, ?, ?, ?, 'cliente')`,
            [nombre.trim(), apellidos.trim(), String(documento).trim(), correo.trim(), hash]
        );

        res.status(201).json({ mensaje: "Cliente registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar cliente" });
    }
}

// POST /api/auth/login -> inicio de sesión para los tres roles
async function login(req, res) {

    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: "Ingresa correo y contraseña" });
        }

        // Verificar que el usuario exista en la base de datos
        const [usuarios] = await pool.execute(
            `SELECT id, nombre, apellidos, correo, contrasena, rol
             FROM usuarios WHERE correo = ?`,
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const usuario = usuarios[0];

        // Comparar la contraseña escrita con la cifrada en la base de datos
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // Generar el token de sesión (dura 2 horas)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Nunca se devuelve la contraseña al cliente
        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
}

module.exports = { registro, login };
