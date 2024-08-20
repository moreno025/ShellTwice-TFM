const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware.js');
const articuloController = require('../controllers/articulo.controller');

router.get('/category/:categoryId', articuloController.getProductsByCategory);
router.post('/crearArticulo', verifyToken, articuloController.crearArticulo);
router.delete('/borrarArticulo', verifyToken, articuloController.eliminarArticulo);
router.put('/actualizarArticulo', verifyToken, articuloController.actualizarArticulo);
router.get('/usuario/:usuarioId', articuloController.getArticulosPorUsuario);

module.exports = router;