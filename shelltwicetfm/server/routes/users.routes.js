const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.get('/me', verifyToken, usersController.getInfoUser);
router.get('/favoritos', verifyToken, usersController.getFavoritos);
router.put('/actualizarUsuario/:id', verifyToken, usersController.actualizarUsuario);
router.post('/favoritos/:articuloId', verifyToken, usersController.toggleFavorito);

module.exports = router;
