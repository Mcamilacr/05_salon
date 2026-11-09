// Asistente virtual con IA ("Lumi"). Botón flotante en la esquina inferior
// derecha que abre una ventana de chat, disponible en todas las páginas.
// Las preguntas se envían al backEnd (/api/asistente), que consulta la
// API de Google Gemini con el catálogo real de servicios del salón.
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import { URL_API } from "../datos/configuracionApi";
import "../estilos/AsistenteVirtual.css";

// Mensaje de bienvenida (solo se muestra, no se envía a la IA)
const BIENVENIDA = {
  rol: "asistente",
  texto: "¡Hola! Soy Lumi, la asistente virtual del salón. Cuéntame qué necesitas (por ejemplo, \"tengo un matrimonio el sábado\") y te recomiendo servicios con sus precios.",
  local: true
};

export default function AsistenteVirtual() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([BIENVENIDA]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const finalChat = useRef(null);

  // Bajar automáticamente al último mensaje
  useEffect(() => {
    finalChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando, abierto]);

  // Enviar la pregunta al backEnd
  const enviar = async (e) => {
    e.preventDefault();
    const pregunta = texto.trim();
    if (!pregunta || cargando) return;

    // Historial: mensajes anteriores sin el saludo inicial
    const historial = mensajes
      .filter((m) => !m.local)
      .map(({ rol, texto }) => ({ rol, texto }));

    setMensajes((anteriores) => [...anteriores, { rol: "usuario", texto: pregunta }]);
    setTexto("");
    setCargando(true);

    try {
      const res = await axios.post(`${URL_API}/asistente`, { mensaje: pregunta, historial });
      setMensajes((anteriores) => [...anteriores, { rol: "asistente", texto: res.data.respuesta }]);
    } catch (error) {
      setMensajes((anteriores) => [
        ...anteriores,
        {
          rol: "asistente",
          texto: error.response?.data?.mensaje || "No pude conectarme. Revisa que el servidor esté encendido.",
          local: true // los errores no se envían como historial
        }
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Ventana del chat */}
      {abierto && (
        <div className="asistente-ventana shadow">
          <div className="asistente-encabezado">
            <strong>Lumi · Asistente virtual</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar asistente"
              onClick={() => setAbierto(false)}
            />
          </div>

          <div className="asistente-mensajes">
            {mensajes.map((m, indice) => (
              <div key={indice} className={`asistente-burbuja ${m.rol === "usuario" ? "es-usuario" : "es-asistente"}`}>
                {m.texto}
              </div>
            ))}
            {cargando && (
              <div className="asistente-burbuja es-asistente">
                <Spinner animation="grow" size="sm" /> Escribiendo...
              </div>
            )}
            <div ref={finalChat} />
          </div>

          <Form onSubmit={enviar} className="asistente-formulario">
            <Form.Control
              placeholder="Escribe tu pregunta..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={500}
              disabled={cargando}
              aria-label="Pregunta para el asistente"
            />
            <Button type="submit" variant="dark" disabled={cargando || !texto.trim()}>
              Enviar
            </Button>
          </Form>

          <small className="asistente-aviso">Respuestas generadas con IA; pueden contener errores.</small>
        </div>
      )}

      {/* Botón flotante */}
      <Button
        className="asistente-boton shadow"
        onClick={() => setAbierto((anterior) => !anterior)}
        aria-label={abierto ? "Cerrar asistente" : "Abrir asistente virtual"}
      >
        {abierto ? "×" : "¿Te ayudo?"}
      </Button>
    </>
  );
}
