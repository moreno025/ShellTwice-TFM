const Categoria =  require('../models/categoria.models.js');
const Articulo = require('../models/articulo.models.js');
const path = require('path');
const fs = require('fs');

// GET de todas las categorías (user)
exports.getCategories = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        const categoriasConAnuncios = [];
        for (let categoria of categorias) {
            const numArticulos = await Articulo.countDocuments({ categoria: categoria._id });
            categoriasConAnuncios.push({
                ...categoria.toObject(),
                numArticulos
            });
        }
        if (categorias.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(categoriasConAnuncios);
    } catch (error) {
        console.error("Error al obtener categorías:", error.message);
        return res.status(500).json({ message: error.message });
    }
};


// POST para crear una categoría (admin)
exports.crearCategoria = async (req, res) => {
    try {
        const { titulo } = req.body;

        const categoriaExistente = await Categoria.findOne({ titulo });
        if (categoriaExistente) {
            return res.status(400).json({ message: 'La categoría ya existe' });
        }

        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ message: 'Se requiere una imagen para la categoría' });
        }

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

        const nuevaCategoria = new Categoria({
            titulo,
            imagen: `/uploads/${path.basename(imagePath)}`
        });
        await nuevaCategoria.save();
        res.status(201).json({ message: 'Categoría creada exitosamente', categoria: nuevaCategoria });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la categoría', error });
    }
};

//DELETE para borrar una categoría (admin)
exports.borrarCategoria = async (req, res) => {
    try{
        const { titulo } = req.body;
        if(!titulo) {
            return res.status(400).json({ message: 'El título de la categoría es requerido.' });
        }
        const categoriaEliminada = await Categoria.findOneAndDelete({ titulo: titulo });
        if(!categoriaEliminada){
            return res.status(404).json({ message: "Categoría no encontrada." });
        }
        res.status(200).json({ message: `Categoría '${titulo}' eliminada con éxito.` });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// PUT para editar una categoría (admin)
exports.actualizarCategoria = async (req, res) => {
    try {
        const { categoriaId } = req.params;
        const { titulo } = req.body;

        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        // Validar si se envió un nuevo título
        if (titulo) {
            categoria.titulo = titulo;
        }

        // Si hay una imagen nueva, se actualiza
        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;

            // Validar el tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!allowedTypes.includes(imagen.mimetype)) {
                return res.status(400).json({ message: 'Solo se permiten archivos de tipo imagen (jpeg, png, gif, jpg)' });
            }

            // Eliminar la imagen anterior si existe
            if (categoria.imagen) {
                const oldImagePath = path.join(__dirname, '..', categoria.imagen);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Guardar la nueva imagen
            const imagePath = path.join(__dirname, '..', 'uploads', `${Date.now()}_${imagen.name}`);
            imagen.mv(imagePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al subir la nueva imagen', err });
                }
            });

            categoria.imagen = `/uploads/${path.basename(imagePath)}`;
        }

        // Guardar la categoría actualizada en la base de datos
        await categoria.save();

        res.status(200).json({ message: 'Categoría actualizada con éxito.', categoria });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

