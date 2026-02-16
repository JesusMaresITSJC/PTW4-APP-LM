//coneccion 
const mysql = require("mysql2");
require("dotenv").config();

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

conexion.connect(err => {
    if (err) {
        console.log("Error al conectar BD:", err);
        return;
    }
    console.log("MySQL conectado");
});

module.exports = conexion;
