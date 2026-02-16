//creacion del servidor 
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

// Puerto
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
