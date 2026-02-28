const express = require("express");
const router = express.Router();
const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");
const ejerciciosController = require("../controllers/ejercicios.controller");

/* =========================
   RUTAS USUARIO
========================= */

// Obtener todos los ejercicios de una lección (usuario normal)
router.get("/lecciones/:id/ejercicios", verificarToken, ejerciciosController.getEjerciciosPorLeccion);


/* =========================
   RUTAS ADMIN
========================= */

// Obtener todos los ejercicios (admin)
router.get("/", verificarToken, verificarAdmin, ejerciciosController.getAllEjercicios);

// Obtener un ejercicio por ID (admin)
router.get("/:id", verificarToken, verificarAdmin, ejerciciosController.getEjercicioById);

// Crear ejercicio simple (admin)
router.post("/", verificarToken, verificarAdmin, ejerciciosController.createEjercicio);

// Crear ejercicio con opciones (admin PRO)
router.post("/con-opciones", verificarToken, verificarAdmin, ejerciciosController.createEjercicioConOpciones);

// Actualizar ejercicio (admin)
router.put("/:id", verificarToken, verificarAdmin, ejerciciosController.updateEjercicio);

// Eliminar ejercicio (admin)
router.delete("/:id", verificarToken, verificarAdmin, ejerciciosController.deleteEjercicio);

// Obtener todos los ejercicios de una lección (admin)
router.get("/leccion/:id", verificarToken, verificarAdmin, ejerciciosController.getEjerciciosPorLeccion);


module.exports = router;