const express = require("express");
const router = express.Router();
const ejerciciosController = require("../controllers/ejercicios.controller");
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");

// USUARIOS (consultar ejercicios por lección)
router.get("/leccion/:id/usuario", verificarToken, ejerciciosController.getEjerciciosPorLeccionUsuario);


// Obtener ejercicios por lección (admin)
router.get("/leccion/:id", verificarToken, verificarAdmin, ejerciciosController.getEjerciciosPorLeccionAdmin);

// Obtener un ejercicio por id
router.get("/:id", verificarToken, ejerciciosController.getEjercicioById);

// CRUD completo para admin
router.post("/", verificarToken, verificarAdmin, ejerciciosController.createEjercicio);
router.put("/:id", verificarToken, verificarAdmin, ejerciciosController.updateEjercicio);
router.delete("/:id", verificarToken, verificarAdmin, ejerciciosController.deleteEjercicio);

// Crear ejercicio con opciones
router.post("/con-opciones", verificarToken, verificarAdmin, ejerciciosController.createEjercicioConOpciones);

module.exports = router;