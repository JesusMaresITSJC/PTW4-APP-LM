const db = require("../database/db");


// =============================
// OBTENER OPCIONES POR EJERCICIO
// =============================
exports.getOpcionesPorEjercicio = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT * 
        FROM opciones
        WHERE id_ejercicio = ?
        ORDER BY id_opcion ASC
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};


// =============================
// OBTENER UNA OPCIÓN POR ID
// =============================
exports.getOpcionById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM opciones WHERE id_opcion = ?";

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Opción no encontrada" });
        }

        res.json(results[0]);
    });
};


// =============================
// CREAR OPCIÓN
// =============================
exports.createOpcion = (req, res) => {
    const { id_ejercicio, texto, es_correcta } = req.body;

    const sql = `
        INSERT INTO opciones (id_ejercicio, texto, es_correcta)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [id_ejercicio, texto, es_correcta ?? 0], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            mensaje: "Opción creada correctamente",
            id_opcion: result.insertId
        });
    });
};


// =============================
// ACTUALIZAR OPCIÓN
// =============================
exports.updateOpcion = (req, res) => {
    const { id } = req.params;
    const { texto, es_correcta } = req.body;

    const sql = `
        UPDATE opciones
        SET texto = ?, es_correcta = ?
        WHERE id_opcion = ?
    `;

    db.query(sql, [texto, es_correcta ?? 0, id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Opción no encontrada" });
        }

        res.json({ mensaje: "Opción actualizada correctamente" });
    });
};


// =============================
// ELIMINAR OPCIÓN
// =============================
exports.deleteOpcion = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM opciones WHERE id_opcion = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Opción no encontrada" });
        }

        res.json({ mensaje: "Opción eliminada correctamente" });
    });
};