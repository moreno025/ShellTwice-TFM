// Se importan las librerias
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const conectarDb = require('./database/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// APIs
const usersRoutes = require('./routes/users.routes.js');
const articuloRoutes = require('./routes/articulo.routes.js');
const categoriaRoutes = require('./routes/categoria.routes.js');

const port = process.env.port || 3001;
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

// Rutas controladores
app.use('/users', usersRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/articulo', articuloRoutes);

// Conexion server
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});