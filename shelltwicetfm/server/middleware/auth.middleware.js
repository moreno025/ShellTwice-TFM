const jwt = require('jsonwebtoken');
const secretKey = 'sdgT42hjIsdfd4567SdfwwEtrGfv5679';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Acceso denegado');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).send('Token no válido');
        req.user = user;
        next();
    });
};

module.exports = { verifyToken };