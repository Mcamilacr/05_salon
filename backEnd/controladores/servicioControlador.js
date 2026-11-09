// Controlador de servicios: mantenimiento de la tabla "servicios".
// Listar y buscar es público (visitantes); crear, modificar y eliminar
// solo lo hace el administrador (ver rutas/servicioRutas.js).

const { pool } = require("../configuracion/baseDatos");

const CATEGORIAS = ["manicura", "peluqueria", "maquillaje", "spa", "depilacion"];

// Valida los datos de un servicio; devuelve un mensaje de error o null
function validarServicio({ categoria, nombre, precio_min, precio_max, duracion_minutos }) {
    if (!categoria || !nombre || precio_min === undefined || precio_max === undefined) {
        return "Categoría, nombre y precios son obligatorios";
    }
    if (!CATEGORIAS.includes(categoria)) {
        return "Categoría no válida";
    }
    if (Number(precio_min) < 0 || Number(precio_max) < Number(precio_min)) {
        return "El precio máximo debe ser mayor o igual al mínimo";
    }
    if (duracion_minutos !== undefined && Number(duracion_minutos) <= 0) {
        return "La duración debe ser mayor que cero";
    }
    return null;
}

// GET /api/servicios?buscar=texto&categoria=spa -> lista y busca servicios
async function listarServicios(req, res) {

    try {
        const { buscar, categoria } = req.query;
        let sql = "SELECT * FROM servicios WHERE 1 = 1";
        const parametros = [];

        // Búsqueda por nombre o descripción
        if (buscar) {
            sql += " AND (nombre LIKE ? OR descripcion LIKE ?)";
            parametros.push(`%${buscar}%`, `%${buscar}%`);
        }
        // Filtro por categoría
        if (categoria) {
            sql += " AND categoria = ?";
            parametros.push(categoria);
        }

        sql += " ORDER BY categoria, nombre";

        const [servicios] = await pool.execute(sql, parametros);
        res.status(200).json({ servicios });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar servicios" });
    }
}

// POST /api/servicios -> crea un servicio
async function crearServicio(req, res) {

    try {
        const error = validarServicio(req.body);
        if (error) return res.status(400).json({ mensaje: error });

        const { categoria, nombre, descripcion, precio_min, precio_max, duracion_minutos } = req.body;

        await pool.execute(
            `INSERT INTO servicios
             (categoria, nombre, descripcion, precio_min, precio_max, duracion_minutos)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [categoria, nombre.trim(), descripcion || null, precio_min, precio_max, duracion_minutos || 60]
        );

        res.status(201).json({ mensaje: "Servicio creado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el servicio" });
    }
}

// PUT /api/servicios/:id -> modifica un servicio
async function actualizarServicio(req, res) {

    try {
        const error = validarServicio(req.body);
        if (error) return res.status(400).json({ mensaje: error });

        const { categoria, nombre, descripcion, precio_min, precio_max, duracion_minutos } = req.body;

        const [resultado] = await pool.execute(
            `UPDATE servicios
             SET categoria = ?, nombre = ?, descripcion = ?, precio_min = ?,
                 precio_max = ?, duracion_minutos = ?
             WHERE id = ?`,
            [categoria, nombre.trim(), descripcion || null, precio_min, precio_max, duracion_minutos || 60, req.params.id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Servicio no encontrado" });
        }

        res.status(200).json({ mensaje: "Servicio actualizado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el servicio" });
    }
}

// DELETE /api/servicios/:id -> elimina un servicio (y sus citas)
async function eliminarServicio(req, res) {

    try {
        const [resultado] = await pool.execute("DELETE FROM servicios WHERE id = ?", [req.params.id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Servicio no encontrado" });
        }

        res.status(200).json({ mensaje: "Servicio eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el servicio" });
    }
}

module.exports = { listarServicios, crearServicio, actualizarServicio, eliminarServicio };
