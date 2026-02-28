const express = require("express");
const router = express.Router();

const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");
const idiomasController = require("../controllers/idiomas.controller");

/* =========================
   RUTAS PARA USUARIO NORMAL
========================= */

// Ver idiomas disponibles
router.get("/", verificarToken, idiomasController.getIdiomas);

// Ver progreso personal
router.get("/progreso", verificarToken, idiomasController.getProgresoIdiomas);


/* =========================
   RUTAS SOLO PARA ADMIN
========================= */

// Obtener idioma por ID
router.get("/:id", verificarToken, verificarAdmin, idiomasController.getIdiomaById);

// Crear idioma
router.post("/", verificarToken, verificarAdmin, idiomasController.createIdioma);

// Actualizar idioma
router.put("/:id", verificarToken, verificarAdmin, idiomasController.updateIdioma);

// Eliminar idioma
router.delete("/:id", verificarToken, verificarAdmin, idiomasController.deleteIdioma);

module.exports = router;