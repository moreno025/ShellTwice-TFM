// Se importan las librerias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const conectarDb = require('./database/database.js');

const port = process.env.port || 3000;
dotenv.config();

// Middleware cors, express y JSON
const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use(bodyParser.json());

// Conexion a la base de datos
conectarDb();

// Routes APIs
//const userRoutes = require('./routes/User.routes.js');

// Rutas controladores
//app.use('/users', userRoutes);

// Conexion server
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});