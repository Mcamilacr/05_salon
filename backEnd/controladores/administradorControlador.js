// Controlador del administrador: gestión de personal y clientes.
// Todas estas funciones solo se ejecutan si el usuario es administrador
// (lo verifica el intermediario en rutas/administradorRutas.js).

const bcrypt = require("bcryptjs");
const { pool } = require("../configuracion/baseDatos");

// POST /api/admin/personal -> crea una cuenta de personal
async function crearPersonal(req, res) {

    try {
        const { nombre, apellidos, documento, correo, telefono, cargo, contrasena } = req.body;

        if (!nombre || !apellidos || !documento || !correo || !contrasena) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        if (contrasena.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        const [existente] = await pool.execute(
            "SELECT id FROM usuarios WHERE correo = ? OR documento = ?",
            [correo, documento]
        );

        if (existente.length > 0) {
            return res.status(409).json({ mensaje: "El correo o documento ya existe" });
        }

        const hash = await bcrypt.hash(contrasena, 12);

        // creado_por guarda el id del administrador que creó la cuenta
        await pool.execute(
            `INSERT INTO usuarios
             (nombre, apellidos, documento, correo, telefono, cargo, contrasena, rol, creado_por)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'personal', ?)`,
            [
                nombre.trim(),
                apellidos.trim(),
                String(documento).trim(),
                correo.trim(),
                telefono || null,
                cargo || null,
                hash,
                req.usuario.id
            ]
        );

        res.status(201).json({ mensaje: "Personal creado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear personal" });
    }
}

// Arma el filtro de búsqueda por nombre, apellidos, documento o correo
function filtroBusqueda(buscar, prefijo = "") {
    if (!buscar) return { sql: "", parametros: [] };
    const texto = `%${buscar}%`;
    return {
        sql: ` AND (${prefijo}nombre LIKE ? OR ${prefijo}apellidos LIKE ?
                    OR ${prefijo}documento LIKE ? OR ${prefijo}correo LIKE ?)`,
        parametros: [texto, texto, texto, texto]
    };
}

// GET /api/admin/personal?buscar=texto -> lista y busca el personal
async function listarPersonal(req, res) {

    try {
        const filtro = filtroBusqueda(req.query.buscar, "p.");
        const [personal] = await pool.execute(
            `SELECT p.id, p.nombre, p.apellidos, p.documento, p.correo,
                    p.telefono, p.cargo, p.fecha_registro,
                    a.nombre AS creado_por
             FROM usuarios p
             LEFT JOIN usuarios a ON a.id = p.creado_por
             WHERE p.rol = 'personal' ${filtro.sql}
             ORDER BY p.id DESC`,
            filtro.parametros
        );

        res.status(200).json({ personal });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar personal" });
    }
}

// GET /api/admin/clientes?buscar=texto -> lista y busca los clientes
async function listarClientes(req, res) {

    try {
        const filtro = filtroBusqueda(req.query.buscar);
        const [clientes] = await pool.execute(
            `SELECT id, nombre, apellidos, documento, correo, fecha_registro
             FROM usuarios
             WHERE rol = 'cliente' ${filtro.sql}
             ORDER BY id DESC`,
            filtro.parametros
        );

        res.status(200).json({ clientes });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar clientes" });
    }
}

// PUT /api/admin/clientes/:id -> modifica los datos de un cliente
async function actualizarCliente(req, res) {

    try {
        const { id } = req.params;
        const { nombre, apellidos, documento, correo } = req.body;

        if (!nombre || !apellidos || !documento || !correo) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Evitar que el nuevo correo o documento choque con OTRO usuario
        const [repetido] = await pool.execute(
            "SELECT id FROM usuarios WHERE (correo = ? OR documento = ?) AND id <> ?",
            [correo, documento, id]
        );

        if (repetido.length > 0) {
            return res.status(409).json({
                mensaje: "El correo o documento ya pertenece a otro usuario"
            });
        }

        const [resultado] = await pool.execute(
            `UPDATE usuarios
             SET nombre = ?, apellidos = ?, documento = ?, correo = ?
             WHERE id = ? AND rol = 'cliente'`,
            [nombre.trim(), apellidos.trim(), String(documento).trim(), correo.trim(), id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        res.status(200).json({ mensaje: "Cliente actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    }
}

// DELETE /api/admin/clientes/:id -> elimina un cliente (y sus citas)
async function eliminarCliente(req, res) {

    try {
        const [resultado] = await pool.execute(
            "DELETE FROM usuarios WHERE id = ? AND rol = 'cliente'",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        res.status(200).json({ mensaje: "Cliente eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el cliente" });
    }
}

// PUT /api/admin/personal/:id -> modifica los datos de un empleado
async function actualizarPersonal(req, res) {

    try {
        const { id } = req.params;
        const { nombre, apellidos, documento, correo, telefono, cargo } = req.body;

        if (!nombre || !apellidos || !documento || !correo) {
            return res.status(400).json({ mensaje: "Nombre, apellidos, documento y correo son obligatorios" });
        }

        const [repetido] = await pool.execute(
            "SELECT id FROM usuarios WHERE (correo = ? OR documento = ?) AND id <> ?",
            [correo, documento, id]
        );

        if (repetido.length > 0) {
            return res.status(409).json({
                mensaje: "El correo o documento ya pertenece a otro usuario"
            });
        }

        const [resultado] = await pool.execute(
            `UPDATE usuarios
             SET nombre = ?, apellidos = ?, documento = ?, correo = ?, telefono = ?, cargo = ?
             WHERE id = ? AND rol = 'personal'`,
            [nombre.trim(), apellidos.trim(), String(documento).trim(), correo.trim(),
             telefono || null, cargo || null, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Empleado no encontrado" });
        }

        res.status(200).json({ mensaje: "Empleado actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el empleado" });
    }
}

// DELETE /api/admin/personal/:id -> elimina un empleado
// (sus citas quedan sin empleado asignado)
async function eliminarPersonal(req, res) {

    try {
        const [resultado] = await pool.execute(
            "DELETE FROM usuarios WHERE id = ? AND rol = 'personal'",
            [req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Empleado no encontrado" });
        }

        res.status(200).json({ mensaje: "Empleado eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el empleado" });
    }
}

module.exports = {
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal,
    listarPersonal,
    listarClientes,
    actualizarCliente,
    eliminarCliente
};
