const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware.js');
const articuloController = require('../controllers/articulo.controller');

router.get('/categorias/:titulo', articuloController.getProductsByCategory);
router.post('/crearArticulo', verifyToken, articuloController.crearArticulo);
router.delete('/borrarArticulo', verifyToken, articuloController.eliminarArticulo);
router.put('/actualizarArticulo/:articuloId', verifyToken, articuloController.actualizarArticulo);
router.get('/usuario/:usuarioId', articuloController.getArticulosPorUsuario);

module.exports = router;