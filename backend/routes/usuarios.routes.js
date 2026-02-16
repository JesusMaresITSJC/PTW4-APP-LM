const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

router.get("/", usuariosController.getUsuarios);
router.post("/", usuariosController.postUsuarios);
router.get("/:id", usuariosController.getUsuarioById);
router.put("/:id", usuariosController.putUsuarios);
router.delete("/:id", usuariosController.deleteUsuarios);

module.exports = router;
