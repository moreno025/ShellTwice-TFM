const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Categoria = require('./categoria.models');
const users = require('./users.models');

const articuloSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    etiquetas: [String],
    ubicacion: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    fecha_publicacion: { type: Date, default: Date.now },
    estado: { type: String, enum: ["Disponible", "No Disponible"], default: "Disponible" },
    categoria: { type: Schema.Types.ObjectId, ref: Categoria, required: true },
    usuario_id: { type: Schema.Types.ObjectId, ref: users, required: true }
});

const Articulo = mongoose.model('Articulo', articuloSchema);

module.exports = Articulo;