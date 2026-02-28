const express = require("express");
const router = express.Router();
const leccionesController = require("../controllers/lecciones.controller");
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");

// =============================
// USUARIOS (solo consultar lecciones por idioma)
// =============================
router.get("/", verificarToken, leccionesController.getLeccionesPorIdioma);
router.post("/:id/responder", verificarToken, leccionesController.responderLeccion);

// =============================
// ADMIN (crear, editar, eliminar lecciones)
// =============================
router.post("/", verificarToken, verificarAdmin, leccionesController.createLeccion);
router.put("/:id", verificarToken, verificarAdmin, leccionesController.updateLeccion);
router.delete("/:id", verificarToken, verificarAdmin, leccionesController.deleteLeccion);



module.exports = router;