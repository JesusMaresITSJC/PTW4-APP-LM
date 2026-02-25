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

