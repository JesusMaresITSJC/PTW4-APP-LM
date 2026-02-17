const db = require("../database/db");

exports.getIdiomas = (req, res) => {
    const sql = "SELECT id_idioma, nombre, codigo_iso FROM idiomas";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
