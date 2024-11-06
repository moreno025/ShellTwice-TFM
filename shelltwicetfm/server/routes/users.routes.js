const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');
const { verify } = require('jsonwebtoken');

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.get('/me', verifyToken, usersController.getInfoUser);
router.get('/favoritos', verifyToken, usersController.getFavoritos);
router.put('/actualizarUsuario/:id', verifyToken, usersController.actualizarUsuario);
router.put('/cambiarEstadoUsuario/:id', verifyToken, isAdmin, usersController.cambiarEstadoUsuario);
router.post('/favoritos/:articuloId', verifyToken, usersController.toggleFavorito);
router.get('/all', verifyToken, isAdmin, usersController.getAllUsers);
router.delete('/delete/:userId', verifyToken, isAdmin, usersController.deleteUser);
router.get('/:userId', verifyToken, isAdmin, usersController.getUserById);
router.get('/:userId/comments', verifyToken, isAdmin, usersController.getComentariosPorUsuario);

module.exports = router;
