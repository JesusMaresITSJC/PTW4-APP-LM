const db = require("../database/db");
exports.getLeccionesPorIdioma = (req, res) => {

    const { idioma } = req.query;

    if (!idioma) {
        return res.status(400).json({ mensaje: "Debe enviar el id del idioma" });
    }

    const sql = `
        SELECT id_leccion, titulo, descripcion, orden
        FROM lecciones
        WHERE id_idioma = ?
        AND activo = 1
        ORDER BY orden ASC
    `;

    db.query(sql, [idioma], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
