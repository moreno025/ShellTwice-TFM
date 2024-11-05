const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    texto: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

const articuloSchema = new Schema({
    imagen: { type: String, required: false },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    etiquetas: [String],
    ubicacion: { type: String, required: true },
    fecha_publicacion: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    estado: { type: String, enum: ["Disponible", "No Disponible"], default: "Disponible" },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    comentarios: [comentarioSchema]
});

const Articulo = mongoose.model('Articulo', articuloSchema);

module.exports = Articulo;