const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    imagen: { type: String, required: false }
    //numero_anuncios: { type: Number, default: 0 } count sobre el número de anuncios
}); 

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;