// Se importan las librerias
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const conectarDb = require('./database/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// APIs
const usersRoutes = require('./routes/users.routes.js');
const articuloRoutes = require('./routes/articulo.routes.js');
const categoriaRoutes = require('./routes/categoria.routes.js');
const valoracionRoutes = require('./routes/valoracion.routes.js');

const port = process.env.port || 3001;
dotenv.config();

// Middleware cors, express y JSON
const app = express();
app.use(cors({
    origin: PROCESS.ENV.BACKEND_ROUTE,
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexion a la base de datos
conectarDb();

// Rutas controladores
app.use('/users', usersRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/articulo', articuloRoutes);
app.use('/valoracion', valoracionRoutes);

// Conexion server
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});
