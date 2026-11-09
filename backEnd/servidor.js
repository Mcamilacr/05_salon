// Punto de entrada del backend (Express).
// Ejecutar con: npm run dev (o npm start)

// Cargar variables del archivo .env (debe ir antes que todo lo demás)
require("dotenv").config({ quiet: true });

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const cors = require("cors");

// Si no hay JWT_SECRET en .env, se genera uno aleatorio para esta ejecución
// (las sesiones se cierran al reiniciar el servidor, pero todo funciona)
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = crypto.randomBytes(64).toString("hex");
    console.warn("Aviso: no hay JWT_SECRET en .env; se generó uno temporal");
}

const { inicializarBaseDatos } = require("./configuracion/baseDatos");
const autenticacionRutas = require("./rutas/autenticacionRutas");
const administradorRutas = require("./rutas/administradorRutas");
const servicioRutas = require("./rutas/servicioRutas");
const citaRutas = require("./rutas/citaRutas");
const archivoRutas = require("./rutas/archivoRutas");
const asistenteRutas = require("./rutas/asistenteRutas");

const app = express();
const PUERTO = process.env.PORT || 3000;

// Permitir peticiones desde el frontEnd de Vite
app.use(cors({ origin: "http://localhost:5173" }));

// Permitir recibir datos en formato JSON (req.body)
app.use(express.json());

// SERVIDOR DE CONTENIDOS: todo lo que esté en la carpeta "publico" se
// entrega tal cual. Ejemplo: publico/imagenes/trabajo1.jpg queda en
// http://localhost:3000/imagenes/trabajo1.jpg
app.use(express.static(path.join(__dirname, "publico")));

// Ruta de prueba: abrir http://localhost:3000 en el navegador
app.get("/", (req, res) => {
    res.send("Servidor del Salón funcionando");
});

// Rutas de la API REST
app.use("/api/auth", autenticacionRutas);
app.use("/api/admin", administradorRutas);
app.use("/api/servicios", servicioRutas);
app.use("/api/citas", citaRutas);
app.use("/api/archivos", archivoRutas);
app.use("/api/asistente", asistenteRutas);

// Crear base de datos y tablas, y luego arrancar el servidor
async function iniciarServidor() {

    try {
        await inicializarBaseDatos();

        app.listen(PUERTO, () => {
            console.log(`Servidor activo en http://localhost:${PUERTO}`);
        });

    } catch (error) {
        console.error("Error de conexión con MySQL:", error.message);
        console.error(
            "Revisa que MySQL esté encendido en XAMPP y que exista el usuario un_usr / una_clave"
        );
        process.exit(1);
    }
}

iniciarServidor();
