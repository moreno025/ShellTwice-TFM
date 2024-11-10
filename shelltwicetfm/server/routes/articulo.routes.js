const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware.js');
const articuloController = require('../controllers/articulo.controller');

router.post('/crearArticulo', verifyToken, articuloController.crearArticulo);
router.get('/buscar', articuloController.buscar);
// Ruta para obtener todos los artículos
router.get('/todos', verifyToken, articuloController.getAllArticulos);
router.get('/categorias/:titulo', articuloController.getProductsByCategory);
router.put('/actualizarArticulo/:articuloId', verifyToken, articuloController.actualizarArticulo);
router.get('/usuario/:id', articuloController.getArticulosPorUsuario);
router.get('/:id', articuloController.getArticulo);
router.delete('/borrarArticulo/:articuloId', verifyToken, articuloController.eliminarArticulo);
router.post('/:id/comentario', verifyToken, articuloController.anadircomentario);

module.exports = router;