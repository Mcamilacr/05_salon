// Conexión a MySQL (XAMPP) y creación automática de la base de datos.
// Al arrancar el servidor se llama a inicializarBaseDatos(), que:
//   1. Crea la base de datos si no existe.
//   2. Crea las 4 tablas si no existen: usuarios, servicios, citas, archivos.
//   3. Inserta los datos iniciales en las tablas que estén vacías
//      (incluye copiar las fotos de archivosEjemplo a la carpeta subidas).
// Así no hay que importar ningún archivo .sql a mano en phpMyAdmin.

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const datos = require("./datosIniciales");

// Datos de conexión: se leen del archivo .env; si no existe, se usan
// los valores exigidos por el profesor (usuario un_usr, clave una_clave)
const configuracion = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "un_usr",
    password: process.env.DB_PASSWORD || "una_clave",
    port: Number(process.env.DB_PORT) || 3306
};

const NOMBRE_BD = process.env.DB_NAME || "salon_db";

// Grupo (pool) de conexiones reutilizables que usan los controladores.
// No se conecta hasta la primera consulta, por eso puede crearse antes
// de que la base de datos exista.
// dateStrings: las fechas llegan como texto ("2026-11-20") y no como Date,
// para evitar cambios de día por la zona horaria.
const pool = mysql.createPool({
    ...configuracion,
    database: NOMBRE_BD,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    dateStrings: true
});

// ---------------------------------------------------------------------
// Estructura de las tablas (modelo relacional)
//   usuarios 1 ── * citas (como cliente y como empleado)
//   servicios 1 ── * citas
//   usuarios 1 ── * archivos (quién subió el archivo)
// ---------------------------------------------------------------------
const TABLAS = [
    // Usuarios de la aplicación con su rol
    `CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(80) NOT NULL,
        apellidos VARCHAR(80) NOT NULL,
        documento VARCHAR(20) NOT NULL UNIQUE,
        correo VARCHAR(120) NOT NULL UNIQUE,
        telefono VARCHAR(20) NULL,
        cargo VARCHAR(50) NULL,
        contrasena VARCHAR(255) NOT NULL,
        rol ENUM('administrador', 'personal', 'cliente') NOT NULL DEFAULT 'cliente',
        creado_por INT NULL,
        fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_usuarios_creado_por
            FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

    // Catálogo de servicios que ofrece el salón
    `CREATE TABLE IF NOT EXISTS servicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        categoria ENUM('manicura', 'peluqueria', 'maquillaje', 'spa', 'depilacion') NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion VARCHAR(255) NULL,
        precio_min INT NOT NULL,
        precio_max INT NOT NULL,
        duracion_minutos INT NOT NULL DEFAULT 60
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

    // Citas agendadas: une cliente, empleado y servicio
    `CREATE TABLE IF NOT EXISTS citas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        empleado_id INT NULL,
        servicio_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') NOT NULL DEFAULT 'pendiente',
        observaciones VARCHAR(255) NULL,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_citas_cliente
            FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        CONSTRAINT fk_citas_empleado
            FOREIGN KEY (empleado_id) REFERENCES usuarios(id) ON DELETE SET NULL,
        CONSTRAINT fk_citas_servicio
            FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

    // Archivos subidos al servidor (texto, imágenes, videos)
    `CREATE TABLE IF NOT EXISTS archivos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_original VARCHAR(255) NOT NULL,
        nombre_guardado VARCHAR(255) NOT NULL UNIQUE,
        tipo VARCHAR(100) NOT NULL,
        tamano INT NOT NULL,
        descripcion VARCHAR(255) NULL,
        usuario_id INT NULL,
        fecha_subida TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_archivos_usuario
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`
];

// Cuenta los registros de una tabla
async function contar(tabla) {
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla}`);
    return Number(total);
}

// Inserta un usuario cifrando su contraseña; devuelve el id generado
async function insertarUsuario(usuario, rol, creadoPor = null) {
    const hash = await bcrypt.hash(usuario.contrasena, 10);

    const [resultado] = await pool.execute(
        `INSERT INTO usuarios
         (nombre, apellidos, documento, correo, telefono, cargo, contrasena, rol, creado_por)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario.nombre,
            usuario.apellidos,
            usuario.documento,
            usuario.correo,
            usuario.telefono || null,
            usuario.cargo || null,
            hash,
            rol,
            creadoPor
        ]
    );

    return resultado.insertId;
}

// Datos iniciales de cada tabla (solo si está vacía)
async function insertarDatosIniciales() {

    // Usuarios: administrador, personal y clientes
    if (await contar("usuarios") === 0) {
        const idAdministrador = await insertarUsuario(datos.administrador, "administrador");

        for (const empleado of datos.personal) {
            await insertarUsuario(empleado, "personal", idAdministrador);
        }
        for (const cliente of datos.clientes) {
            await insertarUsuario(cliente, "cliente");
        }
        console.log("Usuarios iniciales insertados");
    }

    // Servicios
    if (await contar("servicios") === 0) {
        for (const s of datos.servicios) {
            await pool.execute(
                `INSERT INTO servicios
                 (categoria, nombre, descripcion, precio_min, precio_max, duracion_minutos)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [s.categoria, s.nombre, s.descripcion, s.precio_min, s.precio_max, s.duracion_minutos]
            );
        }
        console.log("Servicios iniciales insertados");
    }

    // Citas de ejemplo: se buscan los id a partir del correo y del nombre
    if (await contar("citas") === 0) {
        for (const c of datos.citas) {
            const [[cliente]] = await pool.execute("SELECT id FROM usuarios WHERE correo = ?", [c.cliente]);
            const [[empleado]] = await pool.execute("SELECT id FROM usuarios WHERE correo = ?", [c.empleado]);
            const [[servicio]] = await pool.execute("SELECT id FROM servicios WHERE nombre = ?", [c.servicio]);

            // Si se borró algún dato relacionado, se omite esa cita
            if (!cliente || !servicio) continue;

            await pool.execute(
                `INSERT INTO citas
                 (cliente_id, empleado_id, servicio_id, fecha, hora, estado, observaciones)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [cliente.id, empleado ? empleado.id : null, servicio.id, c.fecha, c.hora, c.estado, c.observaciones]
            );
        }
        console.log("Citas de ejemplo insertadas");
    }

    // Archivos de ejemplo: se copian de archivosEjemplo a subidas con un
    // nombre único y se registran en la tabla, igual que una subida real
    if (await contar("archivos") === 0) {
        const origen = path.join(__dirname, "..", "archivosEjemplo");
        const destino = path.join(__dirname, "..", "subidas");
        fs.mkdirSync(destino, { recursive: true });

        for (const a of datos.archivos) {
            const rutaOrigen = path.join(origen, a.archivo);
            if (!fs.existsSync(rutaOrigen)) continue; // si se borró la foto, se omite

            const [[empleado]] = await pool.execute("SELECT id FROM usuarios WHERE correo = ?", [a.subidoPor]);
            const nombreGuardado = `ejemplo-${Date.now()}-${a.archivo}`;
            fs.copyFileSync(rutaOrigen, path.join(destino, nombreGuardado));

            await pool.execute(
                `INSERT INTO archivos
                 (nombre_original, nombre_guardado, tipo, tamano, descripcion, usuario_id)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [a.archivo, nombreGuardado, "image/jpeg", fs.statSync(rutaOrigen).size,
                 a.descripcion, empleado ? empleado.id : null]
            );
        }
        console.log("Archivos de ejemplo insertados");
    }
}

// Crea la base de datos, las tablas y los datos iniciales
async function inicializarBaseDatos() {

    // 1. Conexión temporal SIN base de datos, para poder crearla
    const conexion = await mysql.createConnection(configuracion);
    await conexion.query(
        `CREATE DATABASE IF NOT EXISTS \`${NOMBRE_BD}\`
         CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`
    );
    await conexion.end();

    // 2. Tablas (en orden, porque citas y archivos dependen de las otras)
    for (const sentencia of TABLAS) {
        await pool.query(sentencia);
    }

    // 3. Datos iniciales
    await insertarDatosIniciales();

    console.log(`Base de datos "${NOMBRE_BD}" lista`);
}

module.exports = { pool, inicializarBaseDatos };
