const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articulo.controller');

router.get('/category/:categoryId', articuloController.getProductsByCategory);

module.exports = router;