// Contexto de autenticación: guarda el usuario y el token de la sesión
// y ofrece login, registro y cierre de sesión a toda la aplicación.
// Los datos se guardan en sessionStorage para no perder la sesión al
// recargar la página (se borran al cerrar la pestaña).
//
// También controla la CADUCIDAD DE LA SESIÓN por inactividad (opcional 6):
// si el usuario no mueve el mouse, no escribe ni hace clic durante
// TIEMPO_INACTIVIDAD_MS, se cierra la sesión y se le regresa al inicio.
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_API, TIEMPO_INACTIVIDAD_MS } from "../datos/configuracionApi";

const ContextoAutenticacion = createContext();

// Acciones del usuario que cuentan como "actividad"
const EVENTOS_ACTIVIDAD = ["mousemove", "keydown", "click", "scroll", "touchstart"];

// Lee el usuario guardado en sessionStorage (o null si no hay)
function leerUsuarioGuardado() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [error, setError] = useState("");
  const [sesionExpirada, setSesionExpirada] = useState(false);
  const navegar = useNavigate();

  // LOGIN: valida correo y contraseña contra la base de datos (backend)
  const login = async (correo, contrasena) => {
    setError("");

    try {
      const res = await axios.post(`${URL_API}/auth/login`, { correo, contrasena });

      setUsuario(res.data.usuario);
      setToken(res.data.token);
      sessionStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      sessionStorage.setItem("token", res.data.token);

      return res.data.usuario;
    } catch (err) {
      setError(err.response?.data?.mensaje || "No fue posible conectar con el servidor");
      throw err;
    }
  };

  // REGISTRO: crea una cuenta de cliente nueva
  const registrarCliente = async (datos) => {
    try {
      const res = await axios.post(`${URL_API}/auth/registro`, datos);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.mensaje || "No fue posible registrar el cliente", { cause: err });
    }
  };

  // CERRAR SESIÓN: borra los datos de la sesión
  const cerrarSesion = useCallback(() => {
    setUsuario(null);
    setToken("");
    setError("");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
  }, []);

  // Borra el mensaje de error (por ejemplo, al reabrir el modal de login)
  const limpiarError = () => setError("");

  // Oculta el aviso de "sesión cerrada por inactividad"
  const cerrarAvisoSesion = () => setSesionExpirada(false);

  // CADUCIDAD DE LA SESIÓN: solo funciona mientras hay un usuario conectado.
  // Cada acción del usuario reinicia el temporizador; si se cumple el
  // tiempo sin actividad, se cierra la sesión y se va al inicio.
  useEffect(() => {
    if (!usuario) return;

    let temporizador;

    const reiniciarTemporizador = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        cerrarSesion();
        setSesionExpirada(true);
        navegar("/");
      }, TIEMPO_INACTIVIDAD_MS);
    };

    EVENTOS_ACTIVIDAD.forEach((evento) => window.addEventListener(evento, reiniciarTemporizador));
    reiniciarTemporizador(); // empieza a contar apenas inicia la sesión

    // Limpieza: al cerrar sesión se quitan el temporizador y los eventos
    return () => {
      clearTimeout(temporizador);
      EVENTOS_ACTIVIDAD.forEach((evento) => window.removeEventListener(evento, reiniciarTemporizador));
    };
  }, [usuario, cerrarSesion, navegar]);

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        token,
        error,
        login,
        registrarCliente,
        cerrarSesion,
        limpiarError,
        sesionExpirada,
        cerrarAvisoSesion,
        autenticado: !!usuario
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}

// Hook para usar el contexto desde cualquier componente
// eslint-disable-next-line react-refresh/only-export-components -- el hook se exporta junto a su proveedor
export function useAutenticacion() {
  return useContext(ContextoAutenticacion);
}
