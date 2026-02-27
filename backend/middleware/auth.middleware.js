const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_clave_secreta_super_segura";

exports.verificarToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. Token requerido." });
    }
    try {
        const tokenLimpio = token.split(" ")[1]; // quitar "Bearer"
        const decoded = jwt.verify(tokenLimpio, SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: "Token inválido" });
    }
};

exports.verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "Solo administradores pueden acceder" });
    }
    next();
};
