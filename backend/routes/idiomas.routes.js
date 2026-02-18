const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/auth.middleware");
const idiomasController = require("../controllers/idiomas.controller");

router.get("/", verificarToken, idiomasController.getIdiomas);
router.get("/progreso", verificarToken, idiomasController.getProgresoIdiomas);

module.exports = router;