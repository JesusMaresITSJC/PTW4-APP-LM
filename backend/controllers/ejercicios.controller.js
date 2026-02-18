const db = require("../database/db");

exports.getEjerciciosPorLeccion = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            e.id_ejercicio,
            e.tipo,
            e.pregunta,
            e.explicacion,
            e.orden,
            o.id_opcion,
            o.texto
        FROM ejercicios e
        LEFT JOIN opciones o 
            ON e.id_ejercicio = o.id_ejercicio
        WHERE e.id_leccion = ?
        ORDER BY e.orden ASC, o.id_opcion ASC
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        const ejerciciosMap = {};
        results.forEach(row => {
            if (!ejerciciosMap[row.id_ejercicio]) {
                ejerciciosMap[row.id_ejercicio] = {
                    id_ejercicio: row.id_ejercicio,
                    tipo: row.tipo,
                    pregunta: row.pregunta,
                    explicacion: row.explicacion,
                    orden: row.orden,
                    opciones: []
                };
            }
            if (row.id_opcion) {
                ejerciciosMap[row.id_ejercicio].opciones.push({
                    id_opcion: row.id_opcion,
                    texto: row.texto
                });
            }
        });
        const ejercicios = Object.values(ejerciciosMap);
        res.json(ejercicios);
    });
};


