const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware.js');
const articuloController = require('../controllers/articulo.controller');

router.post('/crearArticulo', verifyToken, articuloController.crearArticulo);
router.delete('/borrarArticulo', verifyToken, articuloController.eliminarArticulo);
router.get('/buscar', articuloController.buscar);
router.get('/categorias/:titulo', articuloController.getProductsByCategory);
router.put('/actualizarArticulo/:articuloId', verifyToken, articuloController.actualizarArticulo);
router.get('/usuario/:id', articuloController.getArticulosPorUsuario);
router.get('/:id', articuloController.getArticulo);

module.exports = router;