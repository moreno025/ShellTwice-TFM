const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    numero_anuncios: { type: Number, default: 0 }
}); 

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;