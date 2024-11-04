const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
const { isValidObjectId } = require('mongoose');
const Articulo = require('../models/articulo.models.js');

const secretKey = process.env.SECRET_KEY;

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
        const token = jwt.sign({ id: newUser._id }, secretKey, {
            expiresIn: '1h'
        });
        res.status(200).json({ message: 'Usuario creado con éxito', newUser, token });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(400).json({ message: error.message });
    }
};


// Login de users por email y contraseña
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

        const token = jwt.sign({ _id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token, userId: user._id, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// POST para alternar entre agregar y eliminar un artículo de favoritos
exports.toggleFavorito = async (req, res) => {
    try {
        const { articuloId } = req.params;
        const user = await User.findById(req.user._id);
        console.log('el user vale: ', user);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isFavorito = user.favoritos.includes(articuloId);
        if (isFavorito) {
            user.favoritos = user.favoritos.filter(fav => fav.toString() !== articuloId);
            await user.save();
            return res.json({ message: 'Artículo eliminado de favoritos' });
        } else {
            user.favoritos.push(articuloId);
            await user.save();
            return res.json({ message: 'Artículo añadido a favoritos' });
        }
    } catch (error) {
        console.error('Error al alternar artículo de favoritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Ruta para obtener los favoritos del usuario
exports.getFavoritos = async (req, res) => {
    try {
        const usuarioId = req.user._id;
        const user = await User.findById(usuarioId).populate({
            path: 'favoritos',
            populate: { path: 'categoria' }
        });

        if (!user || !user.favoritos || user.favoritos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron artículos en favoritos.' });
        }
        const favoritosUnicos = Array.from(
            new Map(user.favoritos.map(fav => [fav._id.toString(), fav])).values()
        );
        
        res.status(200).json(favoritosUnicos);
    } catch (error) {
        console.error('Error al obtener los favoritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getInfoUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    }catch(error){
        console.error('Error al obtener la información del usuario:', error);
    }
};

// Ruta para actualizar un usuario (solo user verificado y admin)
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuarioAutenticado = req.user;
        const userId = usuarioAutenticado._id;
        const esAdmin = usuarioAutenticado.rol === 1;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (usuario._id.toString() !== userId.toString() && !esAdmin) {
            return res.status(403).json({ message: 'No tienes permisos para editar este usuario' });
        }

        const camposActualizables = ['username', 'name', 'email', 'estado'];
        const updates = {};

        for (const campo of camposActualizables) {
            if (req.body[campo] !== undefined) {
                updates[campo] = req.body[campo];
            }
        }
        updates.updatedAt = Date.now();
        const usuarioActualizado = await User.findByIdAndUpdate(userId, updates, { new: true });

        res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.message);
        return res.status(500).json({ message: 'Error del servidor, inténtalo nuevamente' });
    }
};


