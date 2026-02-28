const express = require("express");
const router = express.Router();
const ejerciciosController = require("../controllers/ejercicios.controller");
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");

// USUARIOS (consultar ejercicios por lección)
router.get("/", verificarToken, ejerciciosController.getEjerciciosPorLeccion); 

// ADMIN (crear, editar, eliminar ejercicios)
router.post("/", verificarToken, verificarAdmin, ejerciciosController.createEjercicio);
router.put("/:id", verificarToken, verificarAdmin, ejerciciosController.updateEjercicio);
router.delete("/:id", verificarToken, verificarAdmin, ejerciciosController.deleteEjercicio);

module.exports = router;