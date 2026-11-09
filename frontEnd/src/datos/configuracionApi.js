// Dirección base del backend (Express). Si cambia el puerto o el servidor,
// solo se modifica aquí y todos los componentes quedan actualizados.
export const URL_API = "http://localhost:3000/api";

// Devuelve la ruta del panel privado según el rol del usuario
export function obtenerRutaPanel(rol) {
  switch (rol) {
    case "administrador":
      return "/panelAdministrador";
    case "personal":
      return "/panelPersonal";
    case "cliente":
      return "/panelCliente";
    default:
      return "/";
  }
}

// Dirección del servidor de contenidos (carpeta publico con express.static)
export const URL_SERVIDOR = "http://localhost:3000";

// Encabezado con el token JWT que exigen las rutas privadas del backend
export function encabezados(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// Formatea un número como precio en pesos: 15000 -> "$15.000"
export function formatearPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

// Nombres legibles de las categorías de servicios
export const CATEGORIAS = {
  manicura: "Manicura y pedicura",
  peluqueria: "Peluquería",
  maquillaje: "Maquillaje",
  spa: "Spa",
  depilacion: "Depilación"
};

// Tiempo sin actividad para cerrar la sesión automáticamente (opcional 6).
// 60 * 1000 = 1 minuto, como pide la guía. Mientras se programa se puede
// subir (por ejemplo 10 * 60 * 1000 = 10 minutos) y volver a 1 minuto
// antes de entregar.
export const TIEMPO_INACTIVIDAD_MS = 60 * 1000;
