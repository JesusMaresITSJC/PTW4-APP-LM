const express = require("express");
const router = express.Router();

const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");
const leccionesController = require("../controllers/lecciones.controller");


// En lecciones.routes.js
router.get("/", verificarToken, verificarAdmin, leccionesController.getAllLeccionesAdmin);
router.post("/:id/completar", verificarToken, leccionesController.completarLeccion);
router.get("/mis-lecciones", verificarToken, leccionesController.misLecciones);
router.post("/:id/responder", verificarToken, leccionesController.responderLeccion);
/* =========================
   RUTAS ADMIN
========================= */

// Ver todas las lecciones
router.get("/admin/all", verificarToken, verificarAdmin, leccionesController.getAllLeccionesAdmin);

// Ver lección por ID
router.get("/admin/:id", verificarToken, verificarAdmin, leccionesController.getLeccionById);

// Crear lección
router.post("/admin", verificarToken, verificarAdmin, leccionesController.createLeccion);

// Actualizar lección
router.put("/admin/:id", verificarToken, verificarAdmin, leccionesController.updateLeccion);

// Desactivar lección
router.delete("/admin/:id", verificarToken, verificarAdmin, leccionesController.deleteLeccion);




module.exports = router;
