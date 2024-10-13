const Articulo = require('../models/articulo.models.js');
const Categoria = require('../models/categoria.models.js');
const Users = require('../models/users.models.js');
const path = require('path');
const fs = require('fs');

// GET de los productos según la categoría (user)
exports.getProductsByCategory = async (req, res) => {
    try {
        const { titulo } = req.params;
        const categoriaExistente = await Categoria.findOne({ titulo: { $regex: new RegExp(`^${titulo}$`, "i") } });
        if (!categoriaExistente) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        const articulos = await Articulo.find({ categoria: categoriaExistente._id })
            .populate('categoria')
            .populate('usuario_id');
        if (articulos.length === 0) {
            return res.status(204).json({ message: "No se encontraron artículos para esta categoría" });
        }
        res.status(200).json(articulos);
    } catch (error) {
        console.error('Error en getProductsByCategory:', error.message);
        return res.status(500).json({ message: error.message });
    }
};

// POST para crear un artículo
exports.crearArticulo = async (req, res) => {
    try {
        const { titulo, descripcion, precio, ubicacion, categoria, usuario_id } = req.body;
        const etiquetas = req.body.etiquetas ? JSON.parse(req.body.etiquetas) : [];

        // Validar que la categoría existe
        const categoriaExistente = await Categoria.findById(categoria);
        if (!categoriaExistente) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Validar que el usuario existe
        const usuarioExistente = await Users.findById(usuario_id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar la imagen
        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ message: 'Se requiere una imagen para el artículo' });
        }

        const imagen = req.files.imagen;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!allowedTypes.includes(imagen.mimetype)) {
            return res.status(400).json({ message: 'Solo se permiten archivos de tipo imagen (jpeg, png, gif, jpg)' });
        }

        // Guardar la imagen
        const imagePath = path.join(__dirname, '..', 'uploads', `${Date.now()}_${imagen.name}`);
        try {
            await imagen.mv(imagePath);
        } catch (err) {
            return res.status(500).json({ message: 'Error al subir la imagen', err });
        }
        

        // Crear y guardar el nuevo artículo
        const nuevoArticulo = new Articulo({
            imagen: `/uploads/${path.basename(imagePath)}`,
            titulo,
            descripcion,
            precio,
            etiquetas,
            ubicacion,
            categoria: categoriaExistente._id,
            usuario_id: usuarioExistente._id
        });

        await nuevoArticulo.save();
        res.status(201).json({ message: 'Artículo creado exitosamente', articulo: nuevoArticulo });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//DELETE para borrar un articulo (admin, user verificado)
exports.eliminarArticulo = async (req, res) => {
    try {
        const { articuloId } = req.params;
        const usuarioAutenticado = req.user;
        // Buscar el artículo por ID
        const articulo = await Articulo.findById(articuloId);
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        // Verificar si el usuario es el dueño del artículo o es un administrador
        if (articulo.usuario_id.toString() !== usuarioAutenticado._id.toString() && usuarioAutenticado.rol !== 0) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este artículo' });
        }
        // Eliminar el artículo
        await articulo.deleteOne();
        res.status(200).json({ message: 'Artículo eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT para editar un artículo (user verificado y admin)
exports.actualizarArticulo = async (req, res) => {
    try {
        const { articuloId } = req.params;
        const usuarioAutenticado = req.user;

        const articulo = await Articulo.findById(articuloId);
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        const camposActualizables = ['imagen', 'titulo', 'descripcion', 'precio', 'etiquetas', 'ubicacion', 'estado', 'categoria'];
        const updates = {};
        for (const campo of camposActualizables) {
            if (req.body[campo] !== undefined) {
                updates[campo] = req.body[campo];
            }
        }

        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!allowedTypes.includes(imagen.mimetype)) {
                return res.status(400).json({ message: 'Solo se permiten archivos de tipo imagen (jpeg, png, gif, jpg)' });
            }

            const imagePath = path.join(__dirname, '..', 'uploads', `${Date.now()}_${imagen.name}`);
            imagen.mv(imagePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la imagen', err });
                }
            });
            updates.imagen = `/uploads/${path.basename(imagePath)}`;
        }

        updates.updatedAt = Date.now();
        const articuloActualizado = await Articulo.findByIdAndUpdate(articuloId, updates, { new: true })
            .populate('categoria')
            .populate('usuario_id');

        res.status(200).json({ message: 'Artículo actualizado exitosamente', articulo: articuloActualizado });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET artículo de un usuario
exports.getArticulosPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.user._id;
        const articulos = await Articulo.find({ usuario_id: usuarioId }).populate('categoria').populate('usuario_id');
        if (articulos.length === 0) {
            return res.status(204).json({ message: 'No se encontraron artículos para este usuario' });
        }
        res.status(200).json(articulos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET de un artículo con los datos
exports.getArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await Articulo.findById({_id: id}).populate('categoria').populate('usuario_id');
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }
        res.status(200).json(articulo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.buscar = async (req, res) => {
    try{
        const { query } = req.query;
        if(!query){
            return res.status(400).json({ message: 'Query es requerido' });
        }

        const articulos = await Articulo.find({
            $or: [
                { titulo: {$regex: query, $options: 'i'} },
                { etiquetas: { $regex: query, $options: 'i' } }
            ]
        }).populate('categoria').populate('usuario_id');

        const categorias = await Categoria.find({
            titulo: { $regex: query, $options: 'i' }
        });
        res.status(200).json({
            articulos,
            categorias
        });
    }catch(error){
        console.error('Error en buscar:', error.message);
        res.status(500).json({ message: error.message });
    }
};
