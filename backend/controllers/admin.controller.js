const db = require("../database/db");
const bcrypt = require("bcrypt");

// 🔹 Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query(
            "SELECT id, nombre, correo, rol, activo, fecha_registro FROM usuarios"
        );
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

// 🔹 Obtener usuario por ID
exports.obtenerUsuario = async (req, res) => {
    try {
        const [usuario] = await db.query(
            "SELECT id, nombre, correo, rol, activo, fecha_registro FROM usuarios WHERE id = ?",
            [req.params.id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json(usuario[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuario" });
    }
};

// 🔹 Crear usuario (con password encriptado)
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        const hash = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)",
            [nombre, correo, hash, rol]
        );

        res.status(201).json({ mensaje: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
};

// 🔹 Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombre, correo, rol, activo } = req.body;

        await db.query(
            "UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, activo = ? WHERE id = ?",
            [nombre, correo, rol, activo, req.params.id]
        );

        res.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario" });
    }
};

// 🔹 Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        await db.query("DELETE FROM usuarios WHERE id = ?", [req.params.id]);
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
};