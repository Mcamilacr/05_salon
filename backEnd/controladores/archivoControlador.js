// Controlador de archivos: subir (cliente -> servidor), descargar
// (servidor -> cliente), listar, modificar la descripción y eliminar.
// Los archivos físicos se guardan en la carpeta backEnd/subidas y sus
// datos (nombre, tipo, tamaño, quién lo subió) en la tabla "archivos".
// Solo lo usan el personal y el administrador (ver rutas/archivoRutas.js).

const fs = require("fs");
const path = require("path");
const { pool } = require("../configuracion/baseDatos");
const { CARPETA_SUBIDAS } = require("../intermediarios/subidaArchivos");

// Busca un archivo por id (o undefined si no existe)
async function buscarArchivo(id) {
    const [[archivo]] = await pool.execute("SELECT * FROM archivos WHERE id = ?", [id]);
    return archivo;
}

// Solo el dueño del archivo o el administrador pueden modificarlo/eliminarlo
function puedeModificar(usuario, archivo) {
    return usuario.rol === "administrador" || archivo.usuario_id === usuario.id;
}

// POST /api/archivos -> sube un archivo (campo "archivo" del formulario)
async function subirArchivo(req, res) {

    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: "Selecciona un archivo" });
        }

        await pool.execute(
            `INSERT INTO archivos
             (nombre_original, nombre_guardado, tipo, tamano, descripcion, usuario_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.file.originalname,
                req.file.filename,
                req.file.mimetype,
                req.file.size,
                req.body.descripcion || null,
                req.usuario.id
            ]
        );

        res.status(201).json({ mensaje: "Archivo subido correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al subir el archivo" });
    }
}

// GET /api/archivos?buscar=texto -> lista los archivos
async function listarArchivos(req, res) {

    try {
        const { buscar } = req.query;
        let sql = `
            SELECT a.id, a.nombre_original, a.tipo, a.tamano, a.descripcion,
                   a.usuario_id, a.fecha_subida,
                   CONCAT(u.nombre, ' ', u.apellidos) AS subido_por
            FROM archivos a
            LEFT JOIN usuarios u ON u.id = a.usuario_id
            WHERE 1 = 1`;
        const parametros = [];

        if (buscar) {
            sql += " AND (a.nombre_original LIKE ? OR a.descripcion LIKE ?)";
            parametros.push(`%${buscar}%`, `%${buscar}%`);
        }

        sql += " ORDER BY a.fecha_subida DESC";

        const [archivos] = await pool.execute(sql, parametros);
        res.status(200).json({ archivos });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar los archivos" });
    }
}

// GET /api/archivos/:id/descargar -> envía el archivo al navegador
async function descargarArchivo(req, res) {

    try {
        const archivo = await buscarArchivo(req.params.id);
        if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });

        const ruta = path.join(CARPETA_SUBIDAS, archivo.nombre_guardado);
        if (!fs.existsSync(ruta)) {
            return res.status(404).json({ mensaje: "El archivo ya no existe en el servidor" });
        }

        // res.download envía el archivo con su nombre original
        res.download(ruta, archivo.nombre_original);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al descargar el archivo" });
    }
}

// PUT /api/archivos/:id -> modifica la descripción
async function actualizarArchivo(req, res) {

    try {
        const archivo = await buscarArchivo(req.params.id);
        if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });
        if (!puedeModificar(req.usuario, archivo)) {
            return res.status(403).json({ mensaje: "No puedes modificar este archivo" });
        }

        await pool.execute(
            "UPDATE archivos SET descripcion = ? WHERE id = ?",
            [req.body.descripcion || null, archivo.id]
        );

        res.status(200).json({ mensaje: "Descripción actualizada" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el archivo" });
    }
}

// DELETE /api/archivos/:id -> elimina el registro y el archivo físico
async function eliminarArchivo(req, res) {

    try {
        const archivo = await buscarArchivo(req.params.id);
        if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });
        if (!puedeModificar(req.usuario, archivo)) {
            return res.status(403).json({ mensaje: "No puedes eliminar este archivo" });
        }

        await pool.execute("DELETE FROM archivos WHERE id = ?", [archivo.id]);

        // Borrar el archivo del disco (si ya no existe, se ignora)
        fs.rm(path.join(CARPETA_SUBIDAS, archivo.nombre_guardado), { force: true }, () => {});

        res.status(200).json({ mensaje: "Archivo eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el archivo" });
    }
}

module.exports = {
    subirArchivo,
    listarArchivos,
    descargarArchivo,
    actualizarArchivo,
    eliminarArchivo
};
