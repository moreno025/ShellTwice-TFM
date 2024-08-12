// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Ruta para el registro de usuario
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);

module.exports = router;
