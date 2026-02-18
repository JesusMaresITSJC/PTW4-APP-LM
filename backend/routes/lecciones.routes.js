const express = require("express");
const router = express.Router();

const { verificarToken } = require("../middleware/auth.middleware");
const leccionesController = require("../controllers/lecciones.controller");


router.get("/", verificarToken, leccionesController.getLeccionesPorIdioma);
router.post("/:id/completar", verificarToken, leccionesController.completarLeccion);
router.get("/mis-lecciones", verificarToken, leccionesController.misLecciones);
router.post("/:id/responder", verificarToken, leccionesController.responderLeccion);




module.exports = router;
