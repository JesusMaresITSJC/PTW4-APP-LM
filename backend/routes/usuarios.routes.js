const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const { verificarToken } = require("../middleware/auth.middleware");

//proteger contraseñas
//router.use(verificarToken);   //las dos sirven para lo mismo
router.get("/", verificarToken, usuariosController.getUsuarios);

//demas metodos
//router.get("/", usuariosController.getUsuarios);
//router.post("/", usuariosController.postUsuarios);
router.get("/perfil", verificarToken, usuariosController.getPerfil);
router.put("/perfil", verificarToken, usuariosController.actualizarPerfil);
router.get("/:id", usuariosController.getUsuarioById);
//router.put("/:id", usuariosController.putUsuarios);
//router.delete("/:id", usuariosController.deleteUsuarios);



module.exports = router;
