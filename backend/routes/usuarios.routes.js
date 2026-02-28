const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");

// =============================
// RUTAS ADMIN
// =============================
router.get("/", verificarToken, verificarAdmin, usuariosController.getUsuarios);
router.post("/", verificarToken, verificarAdmin, usuariosController.postUsuarios);
router.get("/:id", verificarToken, verificarAdmin, usuariosController.getUsuarioById);
router.put("/:id", verificarToken, verificarAdmin, usuariosController.putUsuarios);
router.delete("/:id", verificarToken, verificarAdmin, usuariosController.deleteUsuarios);

// =============================
// RUTAS PERFIL USUARIO AUTENTICADO
// =============================
router.get("/perfil", verificarToken, usuariosController.getPerfil);
router.put("/perfil", verificarToken, usuariosController.actualizarPerfil);

module.exports = router;