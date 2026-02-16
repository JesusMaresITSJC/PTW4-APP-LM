const router = require("express").Router();
const db = require("../db");

// OBTENER TODOS LOS USUARIOS
router.get("/", (req, res) => {
    const sql = "SELECT * FROM usuarios";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//AGREGAR USUARIO
router.post("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, correo } = req.body;
    console.log(req.body);
    const sql = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
    db.query(sql, [id, nombre, correo], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario actualizado correctamente" });
    });
});

module.exports = router;
