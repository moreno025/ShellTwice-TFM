const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

// Ruta para el registro de usuario
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.post('/favoritos/:articuloId', verifyToken, usersController.toggleFavorito);
router.get('/favoritos', verifyToken, usersController.getFavoritos);


module.exports = router;
