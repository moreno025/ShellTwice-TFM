const jwt = require('jsonwebtoken');
const users = require('../models/users.models');
const secretKey = 'sdgT42hjIsdfd4567SdfwwEtrGfv5679';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Acceso denegado');

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) return res.status(403).send('Token no válido');

        try {
            const user = await users.findById(decoded._id);
            if (!user) return res.status(404).send('Usuario no encontrado');
            if (user.estado !== 'Activo') return res.status(403).send('Usuario no activo');

            req.user = {
                _id: user._id,
                rol: user.rol,
            };
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error al verificar el usuario', error });
        }
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== 0) {
        return res.status(403).send('Acceso denegado: solo administradores');
    }
    next();
};

module.exports = { verifyToken, isAdmin };
