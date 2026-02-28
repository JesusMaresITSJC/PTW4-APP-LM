const express = require("express");
const router = express.Router();

const { verificarToken, verificarAdmin } = require("../middleware/auth.middleware");
const idiomasController = require("../controllers/idiomas.controller");

//routas usuario
// Ver idiomas disponibles
router.get("/", verificarToken, idiomasController.getIdiomas);
// Ver progreso personal
router.get("/progreso", verificarToken, idiomasController.getProgresoIdiomas);

//routas para admin
// Obtener idioma por ID
router.get("/admin/all", verificarToken, verificarAdmin, idiomasController.getIdiomas);
// Crear idioma
router.post("/", verificarToken, verificarAdmin, idiomasController.createIdioma);
// Actualizar idioma 
router.put("/:id", verificarToken, verificarAdmin, idiomasController.updateIdioma);
// Eliminar idioma
router.delete("/:id", verificarToken, verificarAdmin, idiomasController.deleteIdioma);

module.exports = router;