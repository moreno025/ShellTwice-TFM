const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Articulo = require('./articulo.models');

const etiquetaSchema = new Schema({
    nombre_etiqueta: { type: String, required: true, unique: true },
    //articulos: [{ type: Schema.Types.ObjectId, ref: Articulo }]
});

const Etiqueta = mongoose.model('Etiqueta', etiquetaSchema);

module.exports = Etiqueta;
