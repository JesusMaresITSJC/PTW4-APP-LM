//creacion del servidor 
const express = require("express");
const cors = require("cors");
const idiomasRoutes = require("./routes/idiomas.routes");
const leccionesRoutes = require("./routes/lecciones.routes");
const ejerciciosRoutes = require("./routes/ejercicios.routes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/idiomas", idiomasRoutes);
app.use("/api/lecciones", leccionesRoutes);
app.use("/api", ejerciciosRoutes);
app.use("/api/idiomas", require("./routes/idiomas.routes"));


// Puerto
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
