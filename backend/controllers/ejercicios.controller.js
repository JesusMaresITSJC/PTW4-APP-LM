const db = require("../database/db");

exports.getEjerciciosPorLeccion = (req, res) => {
    const id_leccion = req.query.leccion;
    if (!id_leccion) return res.status(400).json({ mensaje: "Debe enviar id de lección" });

    const sql = `
        SELECT 
            e.id_ejercicio, e.tipo, e.pregunta, e.explicacion, e.orden,
            o.id_opcion, o.texto, o.es_correcta
        FROM ejercicios e
        LEFT JOIN opciones o ON e.id_ejercicio = o.id_ejercicio
        WHERE e.id_leccion = ?
        ORDER BY e.orden ASC, o.id_opcion ASC
    `;

    db.query(sql, [id_leccion], (err, results) => {
        if (err) return res.status(500).json(err);

        const mapEjercicios = {};
        results.forEach(r => {
            if (!mapEjercicios[r.id_ejercicio]) {
                mapEjercicios[r.id_ejercicio] = {
                    id_ejercicio: r.id_ejercicio,
                    tipo: r.tipo,
                    pregunta: r.pregunta,
                    explicacion: r.explicacion,
                    orden: r.orden,
                    opciones: []
                };
            }
            if (r.id_opcion) {
                mapEjercicios[r.id_ejercicio].opciones.push({
                    id_opcion: r.id_opcion,
                    texto: r.texto,
                    es_correcta: r.es_correcta
                });
            }
        });

        res.json(Object.values(mapEjercicios));
    });
};

// =============================
// OBTENER TODOS (ADMIN)
// =============================
exports.getAllEjercicios = (req, res) => {
    const sql = "SELECT * FROM ejercicios ORDER BY id_leccion, orden ASC";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};


// =============================
// OBTENER UNO POR ID
// =============================
exports.getEjercicioById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM ejercicios WHERE id_ejercicio = ?";

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
        }

        res.json(results[0]);
    });
};


// =============================
// CREAR EJERCICIO
// =============================
exports.createEjercicio = (req, res) => {
    const { id_leccion, tipo, pregunta, explicacion, orden } = req.body;

    const sql = `
        INSERT INTO ejercicios (id_leccion, tipo, pregunta, explicacion, orden)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [id_leccion, tipo, pregunta, explicacion, orden], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            mensaje: "Ejercicio creado correctamente",
            id_ejercicio: result.insertId
        });
    });
};


// =============================
// ACTUALIZAR EJERCICIO
// =============================
exports.updateEjercicio = (req, res) => {
    const { id } = req.params;
    const { id_leccion, tipo, pregunta, explicacion, orden } = req.body;

    const sql = `
        UPDATE ejercicios
        SET id_leccion = ?, tipo = ?, pregunta = ?, explicacion = ?, orden = ?
        WHERE id_ejercicio = ?
    `;

    db.query(sql, [id_leccion, tipo, pregunta, explicacion, orden, id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
        }

        res.json({ mensaje: "Ejercicio actualizado correctamente" });
    });
};


// =============================
// ELIMINAR EJERCICIO
// =============================
exports.deleteEjercicio = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM ejercicios WHERE id_ejercicio = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Ejercicio no encontrado" });
        }

        res.json({ mensaje: "Ejercicio eliminado correctamente" });
    });
};

// ========================================
// CREAR EJERCICIO CON OPCIONES (PRO)
// ========================================
exports.createEjercicioConOpciones = (req, res) => {
    const {
        id_leccion,
        tipo,
        pregunta,
        explicacion,
        orden,
        opciones
    } = req.body;

    // 🔎 Validaciones básicas
    if (!opciones || opciones.length === 0) {
        return res.status(400).json({ mensaje: "Debe incluir al menos una opción" });
    }

    const opcionesCorrectas = opciones.filter(o => o.es_correcta === 1);

    if (opcionesCorrectas.length === 0) {
        return res.status(400).json({ mensaje: "Debe haber una opción correcta" });
    }

    if (opcionesCorrectas.length > 1) {
        return res.status(400).json({ mensaje: "Solo puede haber una opción correcta" });
    }

    // 🚀 INICIAR TRANSACCIÓN
    db.beginTransaction(err => {
        if (err) return res.status(500).json(err);

        const sqlEjercicio = `
            INSERT INTO ejercicios 
            (id_leccion, tipo, pregunta, explicacion, orden)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sqlEjercicio,
            [id_leccion, tipo, pregunta, explicacion, orden],
            (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                const idEjercicio = result.insertId;

                const sqlOpcion = `
                    INSERT INTO opciones 
                    (id_ejercicio, texto, es_correcta)
                    VALUES (?, ?, ?)
                `;

                const opcionesPromises = opciones.map(op =>
                    new Promise((resolve, reject) => {
                        db.query(
                            sqlOpcion,
                            [idEjercicio, op.texto, op.es_correcta ?? 0],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            }
                        );
                    })
                );

                Promise.all(opcionesPromises)
                    .then(() => {
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json(err);
                                });
                            }

                            res.status(201).json({
                                mensaje: "Ejercicio y opciones creados correctamente",
                                id_ejercicio: idEjercicio
                            });
                        });
                    })
                    .catch(err => {
                        db.rollback(() => {
                            res.status(500).json(err);
                        });
                    });
            }
        );
    });
};





