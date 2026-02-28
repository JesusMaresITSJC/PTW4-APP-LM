const express = require("express");
const router = express.Router();
const leccionesController = require("../controllers/lecciones.controller");
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");

// =============================
// USUARIOS (solo consultar lecciones por idioma)
// =============================
router.get("/", verificarToken, leccionesController.getLecciones);
router.post("/:id/responder", verificarToken, leccionesController.responderLeccion);

// =============================
// ADMIN (crear, editar, eliminar lecciones)
// =============================
router.get("/admin/all", verificarToken, verificarAdmin, leccionesController.getAllLeccionesAdmin);
router.get("/admin/:id", verificarToken, verificarAdmin, leccionesController.getLeccionById);
router.post("/", verificarToken, verificarAdmin, leccionesController.createLeccion);
router.put("/admin/:id", verificarToken, verificarAdmin, leccionesController.updateLeccion);
router.delete("/admin/:id", verificarToken, verificarAdmin, leccionesController.deleteLeccion);



module.exports = router;