const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware.js');
const categoriaController = require('../controllers/categoria.controller');

router.get('/list-categorias', categoriaController.getCategories);
router.post('/crearCategoria', verifyToken, isAdmin, categoriaController.createCategory);
router.delete('/borrarCategoria', verifyToken, isAdmin, categoriaController.borrarCategoria);
router.put('/actualizarCategoria', verifyToken, isAdmin, categoriaController.actualizarCategoria);

module.exports = router;