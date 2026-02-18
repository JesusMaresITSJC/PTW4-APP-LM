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

exports.completarLeccion = (req, res) => {

    const id_usuario = req.usuario.id;
    const { id } = req.params;
    const { puntaje } = req.body;

    if (puntaje === undefined) {
        return res.status(400).json({ mensaje: "Debe enviar el puntaje" });
    }

    const sql = `
        INSERT INTO usuario_lecciones 
        (id, id_leccion, completada, puntaje, fecha_completada)
        VALUES (?, ?, TRUE, ?, CURDATE())
        ON DUPLICATE KEY UPDATE
            completada = TRUE,
            puntaje = VALUES(puntaje),
            fecha_completada = CURDATE()
    `;

    db.query(sql, [id_usuario, id, puntaje], (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            mensaje: "Lección completada correctamente",
            puntaje
        });
    });
};

exports.misLecciones = (req, res) => {

    const id_usuario = req.usuario.id;

    const sql = `
        SELECT 
            l.id_leccion,
            l.titulo,
            ul.completada,
            ul.puntaje,
            ul.fecha_completada
        FROM usuario_lecciones ul
        JOIN lecciones l ON l.id_leccion = ul.id_leccion
        WHERE ul.id = ?
    `;

    db.query(sql, [id_usuario], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};


