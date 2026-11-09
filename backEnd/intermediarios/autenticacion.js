// Intermediarios (middlewares) de seguridad.
// Se ejecutan antes del controlador para decidir si la petición continúa.

const jwt = require("jsonwebtoken");

// Verifica que la petición traiga un token JWT válido en el encabezado
// "Authorization: Bearer <token>". Si es válido, guarda en req.usuario
// los datos del token (id y rol) para que los use el controlador.
function verificarToken(req, res, next) {

    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Debes iniciar sesión" });
    }

    const token = autorizacion.split(" ")[1];

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ mensaje: "Sesión inválida o expirada" });
    }
}

// Permite continuar solo si el rol del usuario está en la lista recibida.
// Ejemplo de uso: permitirRoles("administrador")
function permitirRoles(...roles) {

    return (req, res, next) => {

        if (!req.usuario || !roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                mensaje: "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
}

module.exports = { verificarToken, permitirRoles };
