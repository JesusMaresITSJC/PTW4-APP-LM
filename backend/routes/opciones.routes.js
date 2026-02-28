const express = require("express");
const router = express.Router();
const { verificarToken, verificarAdmin  } = require("../middleware/auth.middleware");
const opcionesController = require("../controllers/opciones.controller");

// Obtener opciones por ejercicio
router.get("/ejercicio/:id", verificarToken, opcionesController.getOpcionesPorEjercicio);

// CRUD de admin
// Obtener opciones de un ejercicio
router.get("/opciones/ejercicio/:id", verificarToken, verificarAdmin, opcionesController.getOpcionesPorEjercicio);

// Crear opción
router.post("/opciones", verificarToken, verificarAdmin, opcionesController.createOpcion);

// Actualizar opción
router.put("/:id", verificarToken, verificarAdmin, opcionesController.updateOpcion);

// Eliminar opción (si quieres)
router.delete("/opciones/:id", verificarToken, verificarAdmin, opcionesController.deleteOpcion);

module.exports = router;