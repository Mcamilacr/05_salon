// Controlador del asistente virtual con IA (API de Google Gemini).
//
// Funcionamiento:
//   1. El frontEnd envía la pregunta del usuario y los últimos mensajes
//      de la conversación.
//   2. Este controlador lee de MySQL el catálogo REAL de servicios con
//      sus precios y arma unas instrucciones fijas para la IA ("eres el
//      asistente del salón, solo recomiendas estos servicios...").
//   3. Envía todo a la API de Gemini y devuelve la respuesta al frontEnd.
// La llave de la API está en el .env (GEMINI_API_KEY), por eso nunca
// llega al navegador.

const { pool } = require("../configuracion/baseDatos");

// Modelo de Gemini (se puede cambiar en el .env)
const MODELO = process.env.GEMINI_MODELO || "gemini-2.5-flash";
const URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`;

// Límites para no gastar la cuota gratuita en mensajes muy largos
const MAXIMO_CARACTERES = 500;
const MAXIMO_HISTORIAL = 10;

// Arma el texto con el catálogo de servicios a partir de la base de datos
async function obtenerCatalogo() {
    const [servicios] = await pool.execute(
        "SELECT categoria, nombre, descripcion, precio_min, precio_max, duracion_minutos FROM servicios ORDER BY categoria, nombre"
    );

    const formato = (n) => "$" + Number(n).toLocaleString("es-CO");

    return servicios
        .map((s) =>
            `- [${s.categoria}] ${s.nombre}: ${s.descripcion || ""} ` +
            `(${formato(s.precio_min)} - ${formato(s.precio_max)}, aprox. ${s.duracion_minutos} min)`
        )
        .join("\n");
}

// Nombres legibles de las categorías (para las instrucciones)
const CATEGORIAS_LEGIBLES = {
    manicura: "manicura y pedicura",
    peluqueria: "peluquería",
    maquillaje: "maquillaje",
    spa: "spa",
    depilacion: "depilación"
};

// Instrucciones fijas que recibe la IA en cada consulta
function instrucciones(catalogo) {
    return `Eres "Lumi", el asistente virtual del Salón de Belleza - SPA, ubicado en Bucaramanga, Colombia.
Respondes SIEMPRE en español, con tono amable y cercano, en máximo 120 palabras.

Tu tarea:
- Recomendar servicios del salón según lo que el cliente cuente (evento, tipo de cabello, estado de uñas, presupuesto, etc.).
- Dar precios y duración usando ÚNICAMENTE el catálogo de abajo. Nunca inventes servicios ni precios.
- Si recomiendas un servicio, invita a agendar la cita iniciando sesión en la página y entrando a "Mis citas".

Reglas:
- Si preguntan algo que no tiene que ver con belleza o con el salón, responde amablemente que solo puedes ayudar con los servicios del salón.
- No des diagnósticos médicos; ante problemas de piel o cuero cabelludo, sugiere consultar a un dermatólogo.
- No uses formato Markdown (nada de asteriscos ni almohadillas); usa texto plano y guiones para listas.

Categorías: ${Object.values(CATEGORIAS_LEGIBLES).join(", ")}.

CATÁLOGO DE SERVICIOS:
${catalogo}`;
}

// POST /api/asistente -> { mensaje, historial: [{ rol: "usuario"|"asistente", texto }] }
async function consultarAsistente(req, res) {

    try {
        const llave = process.env.GEMINI_API_KEY;
        if (!llave) {
            return res.status(503).json({
                mensaje: "El asistente no está configurado: falta GEMINI_API_KEY en el archivo .env"
            });
        }

        const { mensaje, historial = [] } = req.body;

        if (!mensaje || !mensaje.trim()) {
            return res.status(400).json({ mensaje: "Escribe una pregunta" });
        }
        if (mensaje.length > MAXIMO_CARACTERES) {
            return res.status(400).json({ mensaje: `La pregunta no puede superar ${MAXIMO_CARACTERES} caracteres` });
        }

        // Conversación en el formato de Gemini: rol "user" o "model"
        const contenidos = historial
            .slice(-MAXIMO_HISTORIAL)
            .filter((m) => m && typeof m.texto === "string")
            .map((m) => ({
                role: m.rol === "asistente" ? "model" : "user",
                parts: [{ text: m.texto.slice(0, MAXIMO_CARACTERES * 4) }]
            }));

        contenidos.push({ role: "user", parts: [{ text: mensaje.trim() }] });

        const catalogo = await obtenerCatalogo();

        // Petición a la API de Gemini (fetch viene incluido en Node 18+)
        const respuesta = await fetch(URL_GEMINI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": llave
            },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: instrucciones(catalogo) }] },
                contents: contenidos,
                generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
            }),
            signal: AbortSignal.timeout(30000) // máximo 30 segundos de espera
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            console.error("Error de Gemini:", datos.error?.message || datos);
            const limite = respuesta.status === 429;
            return res.status(502).json({
                mensaje: limite
                    ? "El asistente recibió demasiadas preguntas. Intenta de nuevo en un minuto."
                    : "El asistente no está disponible en este momento"
            });
        }

        // El texto de la respuesta viene en candidates[0].content.parts[]
        const texto = (datos.candidates?.[0]?.content?.parts || [])
            .map((parte) => parte.text || "")
            .join("")
            .replace(/\*\*/g, "") // por si la IA usa negritas de Markdown
            .trim();

        res.status(200).json({
            respuesta: texto || "No pude generar una respuesta. ¿Puedes reformular tu pregunta?"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al consultar el asistente" });
    }
}

module.exports = { consultarAsistente };
