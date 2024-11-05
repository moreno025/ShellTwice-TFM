const express = require('express');
const router = express.Router();
const { anadirValoracion, getValoracion, getMediaValoracion } = require('../controllers/valoracion.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/usuario', verifyToken, anadirValoracion);
router.get('/', verifyToken, getValoracion);
router.get('/media', verifyToken, getMediaValoracion);


module.exports = router;
