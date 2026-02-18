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

exports.responderLeccion = (req, res) => {

    const id_usuario = req.usuario.id;
    const id_leccion = req.params.id;
    const { respuestas } = req.body;

    if (!respuestas || respuestas.length === 0) {
        return res.status(400).json({ mensaje: "Debe enviar respuestas" });
    }

    const sql = `
        SELECT 
            e.id_ejercicio,
            o.id_opcion,
            o.texto,
            o.es_correcta
        FROM ejercicios e
        JOIN opciones o ON o.id_ejercicio = e.id_ejercicio
        WHERE e.id_leccion = ?
    `;

    db.query(sql, [id_leccion], (err, opciones) => {

        if (err) return res.status(500).json(err);

        const resultadoDetalle = [];
        let aciertos = 0;

        respuestas.forEach(r => {

            const opcionesEjercicio = opciones.filter(o => o.id_ejercicio == r.id_ejercicio);

            const opcionCorrecta = opcionesEjercicio.find(o => o.es_correcta == 1);
            const opcionUsuario = opcionesEjercicio.find(o => o.id_opcion == r.id_opcion);

            const esCorrecta = opcionCorrecta && opcionCorrecta.id_opcion == r.id_opcion;

            if (esCorrecta) aciertos++;

            resultadoDetalle.push({
                id_ejercicio: r.id_ejercicio,
                respuesta_usuario: opcionUsuario ? opcionUsuario.texto : null,
                correcta: opcionCorrecta ? opcionCorrecta.texto : null,
                es_correcta: esCorrecta
            });

        });

        const totalPreguntas = respuestas.length;
        const puntaje = Math.round((aciertos / totalPreguntas) * 100);

        const sqlGuardar = `
            INSERT INTO usuario_lecciones 
            (id_usuario, id_leccion, completada, puntaje, fecha_completada)
            VALUES (?, ?, TRUE, ?, CURDATE())
            ON DUPLICATE KEY UPDATE
                completada = TRUE,
                puntaje = VALUES(puntaje),
                fecha_completada = CURDATE()
        `;

        db.query(sqlGuardar, [id_usuario, id_leccion, puntaje], (err2) => {

            if (err2) return res.status(500).json(err2);

            res.json({
                mensaje: "Lección evaluada",
                puntaje,
                aciertos,
                totalPreguntas,
                detalle: resultadoDetalle
            });

        });

    });
};
