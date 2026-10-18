
import { createContext, useState, useContext } from "react";

const ContextoAutenticacion = createContext();

const USUARIO_SIMULADO = {
  usuario: "Admin",
  contrasena: "1234",
};

export function ProveedorAutenticacion({ children }) {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [error, setError] = useState("");

  const login = (usuario, contrasena) => {
    if (usuario === USUARIO_SIMULADO.usuario && contrasena === USUARIO_SIMULADO.contrasena) {
      setEstaAutenticado(true);
      setError("");
      return true;
    }
    setError("Usuario o contraseña incorrectos.");
    return false;
  };

  const cerrarSesion = () => {
    setEstaAutenticado(false);
  };

  return (
    <ContextoAutenticacion.Provider value={{ estaAutenticado, login, cerrarSesion, error }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAutenticacion() {
  return useContext(ContextoAutenticacion);
}
