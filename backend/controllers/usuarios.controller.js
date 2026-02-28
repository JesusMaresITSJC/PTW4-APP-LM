const db = require("../database/db");
const bcrypt = require("bcrypt");

// =============================
// OBTENER TODOS LOS USUARIOS
// =============================
exports.getUsuarios = (req, res) => {
    const sql = "SELECT id, nombre, correo, rol FROM usuarios ORDER BY id ASC";
    db.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR MySQL en getUsuarios:", err); // <-- esto te dirá el error real
            return res.status(500).json({ mensaje: "Error en la base de datos", error: err });
        }
        res.json(result);
    });
};

// =============================
// AGREGAR USUARIO
// =============================
exports.postUsuarios = (req, res) => {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    bcrypt.hash(password, 10, (errHash, hash) => {
        if (errHash) return res.status(500).json(errHash);

        const sql = "INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)";
        db.query(sql, [nombre, correo, hash], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                mensaje: "Usuario creado correctamente",
                id_insertado: result.insertId
            });
        });
    });
};

// =============================
// OBTENER USUARIO POR ID
// =============================
exports.getUsuarioById = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json(result[0]);
    });
};

// =============================
// ACTUALIZAR USUARIO
// =============================
exports.putUsuarios = (req, res) => {
    const id = req.params.id;
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({ mensaje: "Faltan datos (nombre o correo)" });
    }

    const sql = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
    db.query(sql, [nombre, correo, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario actualizado correctamente" });
    });
};

// =============================
// ELIMINAR USUARIO
// =============================
exports.deleteUsuarios = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario eliminado correctamente" });
    });
};

// =============================
// PERFIL DEL USUARIO AUTENTICADO
// =============================
exports.getPerfil = (req, res) => {
    const id = req.usuario.id;
    const sql = "SELECT id, nombre, correo, fecha_registro, activo, rol FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json(result[0]);
    });
};

// =============================
// ACTUALIZAR PERFIL
// =============================
exports.actualizarPerfil = (req, res) => {
    const id = req.usuario.id;
    const { nombre, correo, password } = req.body;

    const sqlBuscar = "SELECT * FROM usuarios WHERE id = ?";
    db.query(sqlBuscar, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const usuarioActual = result[0];

        // Validar correo duplicado
        if (correo) {
            const sqlCorreo = "SELECT id FROM usuarios WHERE correo = ? AND id != ?";
            db.query(sqlCorreo, [correo, id], (err2, result2) => {
                if (err2) return res.status(500).json(err2);
                if (result2.length > 0) return res.status(400).json({ mensaje: "El correo ya está en uso" });
                actualizarUsuario(usuarioActual, nombre, correo, password, id, res);
            });
        } else {
            actualizarUsuario(usuarioActual, nombre, correo, password, id, res);
        }
    });
};

// Función helper para actualizar usuario con callbacks
function actualizarUsuario(usuarioActual, nombre, correo, password, id, res) {
    if (password) {
        bcrypt.hash(password, 10, (errHash, hash) => {
            if (errHash) return res.status(500).json(errHash);
            const sqlUpdate = "UPDATE usuarios SET nombre = ?, correo = ?, password_hash = ? WHERE id = ?";
            db.query(sqlUpdate, [nombre || usuarioActual.nombre, correo || usuarioActual.correo, hash, id], (err3) => {
                if (err3) return res.status(500).json(err3);
                res.json({
                    mensaje: "Perfil actualizado correctamente",
                    usuario: { id, nombre: nombre || usuarioActual.nombre, correo: correo || usuarioActual.correo }
                });
            });
        });
    } else {
        const sqlUpdate = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
        db.query(sqlUpdate, [nombre || usuarioActual.nombre, correo || usuarioActual.correo, id], (err3) => {
            if (err3) return res.status(500).json(err3);
            res.json({
                mensaje: "Perfil actualizado correctamente",
                usuario: { id, nombre: nombre || usuarioActual.nombre, correo: correo || usuarioActual.correo }
            });
        });
    }
}