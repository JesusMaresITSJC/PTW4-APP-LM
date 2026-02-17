const db = require("../database/db");
const bcrypt = require("bcrypt");


// OBTENER TODOS LOS USUARIOS
exports.getUsuarios = ("/", (req, res) => {
    const sql = "SELECT * FROM usuarios";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

//AGREGAR USUARIO
exports.postUsuarios = ("/", (req, res) => {
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
exports.getUsuarioById = ("/:id", (req, res) => {
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
exports.putUsuarios = ("/:id", (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    if (!nombre || !correo) {
        return res.status(400).json({ mensaje: "Faltan datos (nombre o correo)" });
    }
    const sql = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
    db.query(sql, [nombre, correo, id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario actualizado correctamente" });
    });
});

//eliminar usuario
exports.deleteUsuarios = ("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario Eliminado correctamente" });
    });
});


// OBTENER PERFIL DEL USUARIO AUTENTICADO
exports.getPerfil = (req, res) => {
    const id = req.usuario.id;
    const sql = "SELECT id, nombre, correo, fecha_registro, activo FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(result[0]);
    });
};

//actualizar perfil de usuario
exports.actualizarPerfil = (req, res) => {
    const id = req.usuario.id; // viene del middleware
    const { nombre, correo, password } = req.body;
    // Buscar usuario actual
    const sqlBuscar = "SELECT * FROM usuarios WHERE id = ?";
    db.query(sqlBuscar, [id], async (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        const usuarioActual = result[0];
        // 2️⃣ Verificar correo duplicado
        if (correo) {
            const sqlCorreo = "SELECT id FROM usuarios WHERE correo = ? AND id != ?";
            db.query(sqlCorreo, [correo, id], async (err2, result2) => {
                if (err2) return res.status(500).json(err2);
                if (result2.length > 0) {
                    return res.status(400).json({ mensaje: "El correo ya está en uso" });
                }
                await actualizarUsuario();
            });
        } else {
            await actualizarUsuario();
        }
        async function actualizarUsuario() {
            let passwordHash = usuarioActual.password_hash;
            // 3️⃣ Si cambia password → hashear
            if (password) {
                passwordHash = await bcrypt.hash(password, 10);
            }
            const sqlUpdate = `
                UPDATE usuarios
                SET nombre = ?, correo = ?, password_hash = ?
                WHERE id = ?
            `;
            db.query(
                sqlUpdate,
                [
                    nombre || usuarioActual.nombre,
                    correo || usuarioActual.correo,
                    passwordHash,
                    id
                ],
                (err3) => {
                    if (err3) return res.status(500).json(err3);
                    res.json({
                        mensaje: "Perfil actualizado correctamente",
                        usuario: {
                            id,
                            nombre: nombre || usuarioActual.nombre,
                            correo: correo || usuarioActual.correo
                        }
                    });
                }
            );
        }
    });
};


