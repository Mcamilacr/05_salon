// Formulario público de registro de clientes nuevos
import { useState } from "react";
import { useAutenticacion } from "../contexto/ContextoAutenticacion";

function RegistroCliente() {

    const { registrarCliente } = useAutenticacion();

    const [datos, setDatos] = useState({
        nombre: "",
        apellidos: "",
        documento: "",
        correo: "",
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

            await registrarCliente(datos);

            setMensaje("Registro realizado correctamente. Ya puedes iniciar sesión.");

            setDatos({
                nombre: "",
                apellidos: "",
                documento: "",
                correo: "",
                contrasena: ""
            });

        } catch (error) {

            // registrarCliente lanza un Error con el mensaje del backend
            setMensaje(error.message || "Error al registrar cliente");
        }
    };

    return (

        <div className="container my-5">

            <div className="card mx-auto p-4"
                style={{ maxWidth: "500px" }}>

                <h2 className="text-center">
                    Registro de clientes
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-3"
                        name="nombre"
                        placeholder="Nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={datos.apellidos}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        name="documento"
                        placeholder="Documento"
                        value={datos.documento}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={datos.correo}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-control mb-3"
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña (mínimo 8 caracteres)"
                        value={datos.contrasena}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                    >
                        Registrarme
                    </button>

                </form>

                {mensaje && (
                    <p className="text-center mt-3">
                        {mensaje}
                    </p>
                )}

            </div>

        </div>
    );
}

export default RegistroCliente;