const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_clave_secreta_super_segura";

// REGISTRO
exports.register = async (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ mensaje: "Faltan datos" });
    }
    try {
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)";
        db.query(sql, [nombre, correo, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ mensaje: "El correo ya está registrado" });
                }
                return res.status(500).json(err);
            }
            res.status(201).json({ mensaje: "Usuario registrado correctamente" });
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ mensaje: "Faltan datos" });
    }

    try {
        const sql = "SELECT * FROM usuarios WHERE correo = ?";
        
        db.query(sql, [correo], async (err, result) => {
            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(400).json({ mensaje: "Credenciales incorrectas" });
            }

            const usuario = result[0];

            if (!usuario.activo) {
                return res.status(403).json({ mensaje: "Usuario desactivado" });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password_hash);

            if (!passwordValido) {
                return res.status(400).json({ mensaje: "Credenciales incorrectas" });
            }

            const token = jwt.sign(
                { 
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol   // 🔥 IMPORTANTE
                },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.json({
                mensaje: "Login exitoso",
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};
