// Controlador de citas: mantenimiento de la tabla "citas".
// Lo que puede hacer cada usuario depende de su rol:
//   - cliente: ve, agenda y cancela sus citas
//   - personal: ve las citas que tiene asignadas y cambia su estado
//   - administrador: ve y gestiona todas las citas

const { pool } = require("../configuracion/baseDatos");

const ESTADOS = ["pendiente", "confirmada", "completada", "cancelada"];

// Consulta base con los nombres del cliente, empleado y servicio (JOIN)
const CONSULTA_CITAS = `
    SELECT c.id, c.fecha, c.hora, c.estado, c.observaciones,
           c.cliente_id, c.empleado_id, c.servicio_id,
           CONCAT(cl.nombre, ' ', cl.apellidos) AS cliente,
           CONCAT(em.nombre, ' ', em.apellidos) AS empleado,
           s.nombre AS servicio, s.categoria
    FROM citas c
    JOIN usuarios cl ON cl.id = c.cliente_id
    LEFT JOIN usuarios em ON em.id = c.empleado_id
    JOIN servicios s ON s.id = c.servicio_id
`;

// Busca una cita por id (o undefined si no existe)
async function buscarCita(id) {
    const [[cita]] = await pool.execute("SELECT * FROM citas WHERE id = ?", [id]);
    return cita;
}

// GET /api/citas?buscar=texto -> lista las citas según el rol
async function listarCitas(req, res) {

    try {
        const { id, rol } = req.usuario;
        const { buscar } = req.query;
        let sql = CONSULTA_CITAS + " WHERE 1 = 1";
        const parametros = [];

        if (rol === "cliente") {
            sql += " AND c.cliente_id = ?";
            parametros.push(id);
        } else if (rol === "personal") {
            sql += " AND c.empleado_id = ?";
            parametros.push(id);
        }

        // Búsqueda por cliente, servicio o estado
        if (buscar) {
            sql += " AND (CONCAT(cl.nombre, ' ', cl.apellidos) LIKE ? OR s.nombre LIKE ? OR c.estado LIKE ?)";
            parametros.push(`%${buscar}%`, `%${buscar}%`, `%${buscar}%`);
        }

        sql += " ORDER BY c.fecha DESC, c.hora DESC";

        const [citas] = await pool.execute(sql, parametros);
        res.status(200).json({ citas });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar las citas" });
    }
}

// POST /api/citas -> agenda una cita
// El cliente agenda para sí mismo; el administrador puede indicar cliente_id
async function crearCita(req, res) {

    try {
        const { id, rol } = req.usuario;
        const { servicio_id, empleado_id, fecha, hora, observaciones } = req.body;
        const clienteId = rol === "administrador" ? req.body.cliente_id : id;

        if (!clienteId || !servicio_id || !fecha || !hora) {
            return res.status(400).json({ mensaje: "Servicio, fecha y hora son obligatorios" });
        }

        // No se permiten citas en fechas pasadas
        // ("en-CA" da el formato AAAA-MM-DD con la fecha local del servidor)
        const hoy = new Date().toLocaleDateString("en-CA");
        if (fecha < hoy) {
            return res.status(400).json({ mensaje: "La fecha no puede ser anterior a hoy" });
        }

        await pool.execute(
            `INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha, hora, observaciones)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [clienteId, empleado_id || null, servicio_id, fecha, hora, observaciones || null]
        );

        res.status(201).json({ mensaje: "Cita agendada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al agendar la cita" });
    }
}

// PUT /api/citas/:id -> modifica una cita
async function actualizarCita(req, res) {

    try {
        const { id, rol } = req.usuario;
        const cita = await buscarCita(req.params.id);

        if (!cita) return res.status(404).json({ mensaje: "Cita no encontrada" });

        // Cliente: solo puede cancelar sus propias citas
        if (rol === "cliente") {
            if (cita.cliente_id !== id) {
                return res.status(403).json({ mensaje: "No puedes modificar esta cita" });
            }
            await pool.execute("UPDATE citas SET estado = 'cancelada' WHERE id = ?", [cita.id]);
            return res.status(200).json({ mensaje: "Cita cancelada" });
        }

        // Personal: solo cambia el estado de las citas asignadas a él
        if (rol === "personal") {
            if (cita.empleado_id !== id) {
                return res.status(403).json({ mensaje: "Esta cita no está asignada a ti" });
            }
            if (!ESTADOS.includes(req.body.estado)) {
                return res.status(400).json({ mensaje: "Estado no válido" });
            }
            await pool.execute("UPDATE citas SET estado = ? WHERE id = ?", [req.body.estado, cita.id]);
            return res.status(200).json({ mensaje: "Estado actualizado" });
        }

        // Administrador: modifica todos los campos
        const { servicio_id, empleado_id, fecha, hora, estado, observaciones } = req.body;

        if (!servicio_id || !fecha || !hora || !ESTADOS.includes(estado)) {
            return res.status(400).json({ mensaje: "Datos de la cita incompletos o no válidos" });
        }

        await pool.execute(
            `UPDATE citas
             SET servicio_id = ?, empleado_id = ?, fecha = ?, hora = ?, estado = ?, observaciones = ?
             WHERE id = ?`,
            [servicio_id, empleado_id || null, fecha, hora, estado, observaciones || null, cita.id]
        );

        res.status(200).json({ mensaje: "Cita actualizada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar la cita" });
    }
}

// DELETE /api/citas/:id -> elimina una cita (solo administrador)
async function eliminarCita(req, res) {

    try {
        const [resultado] = await pool.execute("DELETE FROM citas WHERE id = ?", [req.params.id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Cita no encontrada" });
        }

        res.status(200).json({ mensaje: "Cita eliminada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar la cita" });
    }
}

// GET /api/citas/empleados -> lista corta del personal para los formularios
async function listarEmpleados(req, res) {

    try {
        const [empleados] = await pool.execute(
            `SELECT id, CONCAT(nombre, ' ', apellidos) AS nombre, cargo
             FROM usuarios WHERE rol = 'personal' ORDER BY nombre`
        );
        res.status(200).json({ empleados });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar el personal" });
    }
}

module.exports = { listarCitas, crearCita, actualizarCita, eliminarCita, listarEmpleados };
