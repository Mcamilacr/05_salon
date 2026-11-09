// Formulario del administrador para crear cuentas de personal
import { useState } from "react";
import axios from "axios";
import { URL_API } from "../datos/configuracionApi";

import {
    useAutenticacion
} from "../contexto/ContextoAutenticacion";

function CrearPersonal() {

    const { token } = useAutenticacion();

    const [datos, setDatos] = useState({
        nombre: "",
        apellidos: "",
        documento: "",
        correo: "",
        telefono: "",
        cargo: "",
        contrasena: ""
    });

    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {

        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                `${URL_API}/admin/personal`,
                datos,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMensaje("Personal creado correctamente");

            setDatos({
                nombre: "",
                apellidos: "",
                documento: "",
                correo: "",
                contrasena: ""
            });

        } catch (error) {

            setMensaje(
                error.response?.data?.mensaje ||
                "Error al crear personal"
            );
        }
    };

    return (

        <div className="container my-5">

            <div className="card p-4 mx-auto"
                style={{ maxWidth: "500px" }}>

                <h2>Crear cuenta de personal</h2>

                <form onSubmit={handleSubmit}>

                    {[
                        ["nombre", "Nombre"],
                        ["apellidos", "Apellidos"],
                        ["documento", "Documento"],
                        ["correo", "Correo electrónico"],
                        ["telefono", "Teléfono (opcional)"],
                        ["cargo", "Cargo (opcional)"],
                        ["contrasena", "Contraseña"]
                    ].map(([campo, etiqueta]) => (

                        <div key={campo} className="mb-3">

                            <label>{etiqueta}</label>

                            <input
                                className="form-control"
                                name={campo}
                                type={
                                    campo === "contrasena"
                                        ? "password"
                                        : campo === "correo"
                                            ? "email"
                                            : "text"
                                }
                                value={datos[campo]}
                                onChange={handleChange}
                                minLength={
                                    campo === "contrasena"
                                        ? 8
                                        : undefined
                                }
                                required={campo !== "telefono" && campo !== "cargo"}
                            />

                        </div>

                    ))}

                    <button
                        type="submit"
                        className="btn btn-success w-100"
                    >
                        Crear personal
                    </button>

                </form>

                {mensaje && (
                    <div className="alert alert-info mt-3">
                        {mensaje}
                    </div>
                )}

            </div>

        </div>
    );
}

export default CrearPersonal;
