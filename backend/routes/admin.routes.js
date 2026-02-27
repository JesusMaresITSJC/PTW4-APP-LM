const express = require("express");
const router = express.Router();

const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");
const adminController = require("../controllers/admin.controller");

// CRUD Usuarios (solo admin)

router.get("/usuarios", verificarToken, verificarAdmin, adminController.obtenerUsuarios);

router.get("/usuarios/:id", verificarToken, verificarAdmin, adminController.obtenerUsuario);

router.post("/usuarios", verificarToken, verificarAdmin, adminController.crearUsuario);

router.put("/usuarios/:id", verificarToken, verificarAdmin, adminController.actualizarUsuario);

router.delete("/usuarios/:id", verificarToken, verificarAdmin, adminController.eliminarUsuario);

module.exports = router;