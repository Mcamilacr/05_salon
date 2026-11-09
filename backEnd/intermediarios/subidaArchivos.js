// Configuración de multer: la librería que recibe archivos enviados
// desde un formulario (multipart/form-data) y los guarda en el disco.

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Carpeta donde se guardan los archivos subidos (se crea si no existe)
const CARPETA_SUBIDAS = path.join(__dirname, "..", "subidas");
fs.mkdirSync(CARPETA_SUBIDAS, { recursive: true });

// Tamaño máximo por archivo: 50 MB
const TAMANO_MAXIMO = 50 * 1024 * 1024;

// Tipos permitidos: texto, documentos, imágenes y videos
const TIPOS_PERMITIDOS = [
    /^image\//,
    /^video\//,
    /^text\//,
    /^application\/pdf$/,
    /^application\/msword$/,
    /^application\/vnd\.openxmlformats-officedocument\./
];

// Cada archivo se guarda con un nombre único (fecha + número aleatorio)
// para que dos archivos con el mismo nombre no se sobrescriban
const almacenamiento = multer.diskStorage({
    destination: (req, archivo, cb) => cb(null, CARPETA_SUBIDAS),
    filename: (req, archivo, cb) => {
        const extension = path.extname(archivo.originalname).toLowerCase();
        const unico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unico + extension);
    }
});

// Rechaza los tipos de archivo no permitidos
function filtrarArchivo(req, archivo, cb) {
    const permitido = TIPOS_PERMITIDOS.some((tipo) => tipo.test(archivo.mimetype));
    if (permitido) cb(null, true);
    else cb(new Error("Tipo de archivo no permitido"));
}

const subida = multer({
    storage: almacenamiento,
    limits: { fileSize: TAMANO_MAXIMO },
    fileFilter: filtrarArchivo
});

// Intermediario que recibe un solo archivo del campo "archivo" y
// convierte los errores de multer en respuestas claras para el frontEnd
function recibirArchivo(req, res, next) {
    subida.single("archivo")(req, res, (error) => {
        if (!error) return next();

        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ mensaje: "El archivo supera el máximo de 50 MB" });
        }
        return res.status(400).json({ mensaje: error.message });
    });
}

module.exports = { recibirArchivo, CARPETA_SUBIDAS };
