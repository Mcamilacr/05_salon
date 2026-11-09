// Datos iniciales (semilla) de la base de datos.
// Se insertan automáticamente la PRIMERA vez que arranca el backend,
// solo si la tabla "usuarios" está vacía.
// Las contraseñas se escriben aquí en texto plano, pero se guardan
// cifradas con bcrypt en la base de datos (ver baseDatos.js).
// El personal y los clientes provienen de los datos de prueba del equipo.

// Administrador general: es quien crea el personal y gestiona los clientes
const administrador = {
    nombre: "Administrador",
    apellidos: "General",
    documento: "ADMIN001",
    correo: "admin@05salon.com",
    telefono: null,
    cargo: "Administrador",
    contrasena: "Admin2026_salon",
    rol: "administrador"
};

// Personal del salón (rol "personal")
const personal = [
    { nombre: "María Isabel", apellidos: "Roma Parra", documento: "68794123", correo: "mariapar@gmail.com", telefono: "3669442568", cargo: "Estilista", contrasena: "parramaria6879568" },
    { nombre: "Julián", apellidos: "Valdés Pérez", documento: "764513845", correo: "juliperez@gmail.com", telefono: "3446521369", cargo: "Depilador", contrasena: "julianperez7645369" },
    { nombre: "Daniela", apellidos: "Pérez Moreno", documento: "1006789012", correo: "daniela@gmail.com", telefono: "3056789012", cargo: "Masajista", contrasena: "danielaperez1006012" },
    { nombre: "Sebastián", apellidos: "Ortiz Romero", documento: "1044786985", correo: "ortizrsebas@gmail.com", telefono: "3225798464", cargo: "Manicurista", contrasena: "sebastianortiz1044464" },
    { nombre: "Andrés", apellidos: "Ramírez Castro", documento: "64978432", correo: "castroand@gmail.com", telefono: "3485771236", cargo: "Barbero", contrasena: "andresramirez6497236" },
    { nombre: "Laura Soledad", apellidos: "Sánchez Díaz", documento: "94467833", correo: "soledadsd@gmail.com", telefono: "3497864317", cargo: "Pedicurista", contrasena: "laurasanchez9446317" },
    { nombre: "Camila", apellidos: "Castillo Vega", documento: "1044978564", correo: "vegacamila@gmail.com", telefono: "3024659874", cargo: "Peluquera", contrasena: "camilacastillo1044874" },
    { nombre: "Natalia", apellidos: "Vargas Rojas", documento: "1233698741", correo: "nataly12@gmail.com", telefono: "3649875649", cargo: "Especialista en tintes", contrasena: "nataliavargas1233649" }
];

// Clientes registrados (rol "cliente")
const clientes = [
    { nombre: "Carlos", apellidos: "Rodríguez Pérez", documento: "1098765432", correo: "carlosrop@gmail.com", contrasena: "carlosrodriguez1098" },
    { nombre: "María", apellidos: "Gómez López", documento: "1144765433", correo: "marialope@gmail.com", contrasena: "mariagomez1144" },
    { nombre: "Andrés Felipe", apellidos: "Martínez Díaz", documento: "1099765434", correo: "andresdima@gmail.com", contrasena: "andresmartinez1099" }
];


// Servicios del salón (tomados de frontEnd/src/datos/servicios.js)
const servicios = [
    { categoria: "manicura", nombre: "Manicure", descripcion: "Cuidado de uñas, limpieza, corte y esmaltado", precio_min: 15000, precio_max: 30000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Pedicure", descripcion: "Cuidado y esmaltado de uñas de los pies", precio_min: 20000, precio_max: 40000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Esmaltado Semipermanente", descripcion: "Esmalte de larga duración para manos o pies", precio_min: 40000, precio_max: 80000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Uñas Acrílicas", descripcion: "Extensiones y diseño en acrílico", precio_min: 80000, precio_max: 150000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Uñas en Gel", descripcion: "Uñas esculpidas en gel para mayor duración", precio_min: 70000, precio_max: 120000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Diseños de Arte en Uñas", descripcion: "Decoración personalizada (dibujos, pedrería)", precio_min: 5000, precio_max: 30000, duracion_minutos: 60 },
    { categoria: "manicura", nombre: "Retoque de Uñas", descripcion: "Mantenimiento de uñas acrílicas o en gel", precio_min: 40000, precio_max: 70000, duracion_minutos: 60 },
    { categoria: "peluqueria", nombre: "Corte de Cabello", descripcion: "Corte para damas, caballeros y niños", precio_min: 10000, precio_max: 60000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Peinados", descripcion: "Recogidos, semirecogidos, ondas, trenzas", precio_min: 40000, precio_max: 150000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Alisado Permanente", descripcion: "Keratina, alisado japonés o brasileño", precio_min: 150000, precio_max: 500000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Tintura y Coloración", descripcion: "Tinte completo, balayage, ombré, mechas", precio_min: 40000, precio_max: 500000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Secado y Cepillado", descripcion: "Secado con estilo liso, volumen u ondas", precio_min: 20000, precio_max: 50000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Tratamientos Capilares", descripcion: "Hidratación, nutrición, reconstrucción", precio_min: 40000, precio_max: 120000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Extensiones de Cabello", descripcion: "Aplicación de extensiones", precio_min: 200000, precio_max: 700000, duracion_minutos: 90 },
    { categoria: "peluqueria", nombre: "Permanente Rizada", descripcion: "Rizos permanentes", precio_min: 120000, precio_max: 300000, duracion_minutos: 90 },
    { categoria: "maquillaje", nombre: "Maquillaje Social", descripcion: "Maquillaje para eventos casuales o de día", precio_min: 50000, precio_max: 100000, duracion_minutos: 60 },
    { categoria: "maquillaje", nombre: "Maquillaje de Noche", descripcion: "Maquillaje más elaborado para eventos de noche", precio_min: 80000, precio_max: 150000, duracion_minutos: 60 },
    { categoria: "maquillaje", nombre: "Maquillaje para Novias", descripcion: "Maquillaje especial para bodas", precio_min: 150000, precio_max: 300000, duracion_minutos: 60 },
    { categoria: "maquillaje", nombre: "Maquillaje Artístico", descripcion: "Diseños creativos para eventos especiales", precio_min: 100000, precio_max: 200000, duracion_minutos: 60 },
    { categoria: "maquillaje", nombre: "Maquillaje de Fotografía", descripcion: "Maquillaje para sesiones fotográficas", precio_min: 80000, precio_max: 150000, duracion_minutos: 60 },
    { categoria: "spa", nombre: "Masaje Relajante", descripcion: "Masaje para reducir el estrés y la tensión muscular", precio_min: 50000, precio_max: 120000, duracion_minutos: 60 },
    { categoria: "spa", nombre: "Masaje Descontracturante", descripcion: "Masaje profundo para aliviar contracturas y dolores", precio_min: 80000, precio_max: 150000, duracion_minutos: 60 },
    { categoria: "spa", nombre: "Facial", descripcion: "Limpieza y tratamiento facial personalizado", precio_min: 60000, precio_max: 120000, duracion_minutos: 60 },
    { categoria: "spa", nombre: "Exfoliación Corporal", descripcion: "Exfoliación completa para suavizar la piel", precio_min: 70000, precio_max: 150000, duracion_minutos: 60 },
    { categoria: "spa", nombre: "Spa de Manos y Pies", descripcion: "Hidratación, masajes y cuidado de manos y pies", precio_min: 50000, precio_max: 100000, duracion_minutos: 60 },
    { categoria: "depilacion", nombre: "Depilación Facial", descripcion: "Eliminación de vello en áreas faciales", precio_min: 20000, precio_max: 40000, duracion_minutos: 45 },
    { categoria: "depilacion", nombre: "Depilación de Piernas", descripcion: "Depilación completa o media pierna", precio_min: 30000, precio_max: 80000, duracion_minutos: 45 },
    { categoria: "depilacion", nombre: "Depilación de Brazos", descripcion: "Eliminación de vello en brazos", precio_min: 20000, precio_max: 50000, duracion_minutos: 45 },
    { categoria: "depilacion", nombre: "Depilación de Axilas", descripcion: "Depilación en la zona de las axilas", precio_min: 15000, precio_max: 30000, duracion_minutos: 45 },
    { categoria: "depilacion", nombre: "Depilación Brasileña", descripcion: "Depilación de área de bikini", precio_min: 40000, precio_max: 70000, duracion_minutos: 45 },
    { categoria: "depilacion", nombre: "Depilación con Cera Corporal", descripcion: "Depilación de varias zonas corporales", precio_min: 80000, precio_max: 150000, duracion_minutos: 45 }
];

// Citas de ejemplo. Se relacionan por correo (cliente y empleado) y por
// nombre del servicio; baseDatos.js busca los id correspondientes.
const citas = [
    { cliente: "carlosrop@gmail.com", empleado: "vegacamila@gmail.com", servicio: "Corte de Cabello", fecha: "2026-11-20", hora: "10:00", estado: "confirmada", observaciones: "Corte clásico" },
    { cliente: "marialope@gmail.com", empleado: "ortizrsebas@gmail.com", servicio: "Uñas en Gel", fecha: "2026-11-21", hora: "15:30", estado: "pendiente", observaciones: "Diseño francés" },
    { cliente: "andresdima@gmail.com", empleado: "daniela@gmail.com", servicio: "Masaje Relajante", fecha: "2026-11-22", hora: "09:00", estado: "pendiente", observaciones: "" }
];

// Archivos de ejemplo (fotos de trabajos). Están en backEnd/archivosEjemplo
// y se copian a backEnd/subidas la primera vez que arranca el servidor,
// como si los hubiera subido el empleado indicado por su correo.
const archivos = [
    { archivo: "manicura.jpg", descripcion: "Trabajo de manicura y pedicura", subidoPor: "ortizrsebas@gmail.com" },
    { archivo: "maquillaje.jpg", descripcion: "Maquillaje para evento", subidoPor: "mariapar@gmail.com" },
    { archivo: "spa.jpg", descripcion: "Sesión de spa", subidoPor: "daniela@gmail.com" }
];

module.exports = { administrador, personal, clientes, servicios, citas, archivos };
