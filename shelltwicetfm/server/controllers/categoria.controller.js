const Categoria =  require('../models/categoria.models.js');

// GET de todas las categorías (user)
exports.getCategories = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        if (categorias.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST para crear una categoría (admin)
exports.createCategory = async (req, res) => {
    try{
        const { titulo } = req.body;
        if(!titulo){
            return res.status(400).json({ message: 'Falta el título de la categoría.' });
        }
        const categoria = new Categoria({
            titulo
        });
        const newCategoria = await categoria.save();
        res.json({ message: 'Categoría creada con éxito', newCategoria });
    }catch(error){
        return res.status(500).json({ message: error.message });
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
    try{
        const { titulo } = req.body;
        if(!titulo){
            return res.status(400).json({ message: "El título de la categoría es requerido." });
        }
        const nuevoTitulo = req.body.nuevoTitulo;
        if(!nuevoTitulo || Object.keys(nuevoTitulo).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar." });
        } 
        const categoriaActualizada = await Categoria.findOneAndUpdate(
            { titulo: titulo },
            nuevoTitulo,
            { new: true }
        );
        if(!categoriaActualizada) {
            return res.status(404).json({ message: "Categoría no encontrada." });
        }
        res.status(200).json({ message: "Categoría actualizada con éxito.", categoria: categoriaActualizada });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

