const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth.middleware");
const leccionesController = require("../controllers/lecciones.controller");

router.get("/", verificarToken, leccionesController.getLeccionesPorIdioma);

module.exports = router;
