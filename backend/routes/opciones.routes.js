const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth.middleware");
const opcionesController = require("../controllers/opciones.controller");

// Obtener opciones por ejercicio
router.get("/ejercicio/:id", verificarToken, opcionesController.getOpcionesPorEjercicio);

// CRUD
router.get("/:id", verificarToken, opcionesController.getOpcionById);
router.post("/", verificarToken, opcionesController.createOpcion);
router.put("/:id", verificarToken, opcionesController.updateOpcion);
router.delete("/:id", verificarToken, opcionesController.deleteOpcion);

module.exports = router;