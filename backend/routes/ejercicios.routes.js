const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth.middleware");
const ejerciciosController = require("../controllers/ejercicios.controller");

router.get("/lecciones/:id/ejercicios", verificarToken, ejerciciosController.getEjerciciosPorLeccion);

module.exports = router;
