const db = require("../database/db");

// OBTENER TODOS LOS USUARIOS
exports.getUsuarios = ("/", (req, res) => {
    const sql = "SELECT * FROM usuarios";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//AGREGAR USUARIO
exports.postUsuarios = ("/", (req, res) => {
    const { nombre, correo, password_hash } = req.body;
    const sql = "INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)";
    db.query(sql, [nombre, correo, password_hash], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ mensaje: "Usuario creado", 
        id_insertado: result.insertId
     });
    });
});

//validar por id 
exports.getUsuarioById = ("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(result[0]);
    });
});

//actualizar usuario
exports.putUsuarios = ("/:id", (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    if (!nombre || !correo) {
        return res.status(400).json({ mensaje: "Faltan datos (nombre o correo)" });
    }
    const sql = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
    db.query(sql, [nombre, correo, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario actualizado correctamente" });
    });
});

//eliminar usuario
exports.deleteUsuarios = ("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario Eliminado correctamente" });
    });
});