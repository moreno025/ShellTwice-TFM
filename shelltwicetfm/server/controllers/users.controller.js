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

        const token = jwt.sign({ _id: user._id, username: user.username, rol: user.rol }, secretKey, { expiresIn: '1h' });
        res.json({ token, userId: user._id, rol: user.rol, message: 'Inicio de sesión exitoso' });
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

        try {
            const usuarioActualizado = await User.findByIdAndUpdate(userId, updates, { new: true });
            res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'El nombre de usuario ya existe. Por favor elige otro.' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error.message);
        return res.status(500).json({ message: 'Error del servidor, inténtalo nuevamente' });
    }
};


// Obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
    try {
        const usuarios = await User.aggregate([
            {
                $lookup: {
                    from: 'articulos',
                    localField: '_id',
                    foreignField: 'usuario_id',
                    as: 'articulos'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    estado: 1,
                    anuncios: { $size: '$articulos' }
                }
            }
        ]);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Ruta para eliminar un usuario (solo admin)
exports.deleteUser = async (req, res) => {
    try {
        const usuarioAutenticado = req.user;
        const { userId } = req.params;
        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (usuario._id.toString() === usuarioAutenticado._id.toString()) {
            return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.userId;

    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error del servidor, inténtalo nuevamente' });
    }
};

// GET comentarios de un usuario
exports.getComentariosPorUsuario = async (req, res) => {
    const userId = req.params.userId;  // Corrección: extraemos el userId de req.params como define la ruta

    try {
        // Buscamos artículos con comentarios del usuario específico
        const comentarios = await Articulo.find({ "comentarios.usuario": userId }, "comentarios")
            .populate("comentarios.usuario", "username");

        const userComments = comentarios.flatMap(article =>
            article.comentarios.filter(comment => comment.usuario._id.toString() === userId)
        );

        if (userComments.length === 0) {
            return res.status(204).json({ message: 'No se encontraron comentarios para este usuario' });
        }

        return res.status(200).json(userComments);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        return res.status(500).json({ message: 'Error al obtener comentarios' });
    }
};

// Este controlador permite a los administradores cambiar el estado de un usuario (Activo/Inactivo)
exports.cambiarEstadoUsuario = async (req, res) => {
    try {
        const usuarioAutenticado = req.user;
        const userId = req.params.id;
        const esAdmin = usuarioAutenticado.rol === 0;

        if (!esAdmin) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'ID de usuario no válido' });
        }

        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { estado } = req.body;
        if (!estado || (estado !== 'Activo' && estado !== 'Inactivo')) {
            return res.status(400).json({ message: 'El estado debe ser "Activo" o "Inactivo"' });
        }
        const updates = { estado };

        try {
            const usuarioActualizado = await User.findByIdAndUpdate(userId, updates, { new: true });
            return res.status(200).json({ message: 'Estado del usuario actualizado exitosamente', usuario: usuarioActualizado });
        } catch (error) {
            console.error('Error al actualizar el estado del usuario:', error.message);
            return res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
        }
    } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error.message);
        return res.status(500).json({ message: 'Error del servidor, inténtalo nuevamente' });
    }
};







