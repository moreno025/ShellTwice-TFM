const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');

const secretKey = process.env.SECRET_KEY;

console.log(secretKey);

// Registro de users
exports.signup = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Faltan datos, todos los campos son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        username,
        email,
        password: hashedPassword,
    });

    try {
        const newUser = await user.save();
        res.json({ message: 'Usuario creado con éxito', newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login de users
exports.login = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!password || (!username && !email)) {
        return res.status(400).json({ message: 'Nombre de usuario o email y contraseña son obligatorios' });
    }

    try {
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
