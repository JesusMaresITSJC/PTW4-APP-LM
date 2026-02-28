const db = require("../database/db");

exports.getIdiomas = (req, res) => {
    const sql = "SELECT id_idioma, nombre, codigo_iso FROM idiomas";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getProgresoIdiomas = (req, res) => {
    const idUsuario = req.usuario.id; // viene del middleware JWT

    const sql = `
        SELECT 
            i.id_idioma,
            i.codigo_iso,
            i.nombre,
            COUNT(l.id_leccion) AS total_lecciones,
            COUNT(ul.id_leccion) AS completadas,
            IFNULL(ROUND(
                (COUNT(ul.id_leccion) / NULLIF(COUNT(l.id_leccion),0)) * 100
            ),0) AS porcentaje
        FROM idiomas i
        LEFT JOIN lecciones l 
            ON i.id_idioma = l.id_idioma AND l.activo = 1
        LEFT JOIN usuario_lecciones ul 
            ON ul.id_leccion = l.id_leccion 
            AND ul.id_usuario = ?
            AND ul.completada = 1
        GROUP BY i.id_idioma;
    `;

    db.query(sql, [idUsuario], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getIdiomaById = (req, res) => {
    const sql = "SELECT id_idioma, nombre, codigo_iso FROM idiomas WHERE id_idioma = ?";

    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Idioma no encontrado" });
        }

        res.json(results[0]);
    });
};

exports.createIdioma = (req, res) => {
    const { nombre, codigo_iso } = req.body;

    const sql = "INSERT INTO idiomas (nombre, codigo_iso) VALUES (?, ?)";

    db.query(sql, [nombre, codigo_iso], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({ mensaje: "Idioma creado correctamente" });
    });
};

exports.updateIdioma = (req, res) => {
    const { nombre, codigo_iso } = req.body;

    const sql = `
        UPDATE idiomas 
        SET nombre = ?, codigo_iso = ?
        WHERE id_idioma = ?
    `;

    db.query(sql, [nombre, codigo_iso, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Idioma actualizado correctamente" });
    });
};

exports.deleteIdioma = (req, res) => {
    const sql = "DELETE FROM idiomas WHERE id_idioma = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Idioma eliminado correctamente" });
    });
};