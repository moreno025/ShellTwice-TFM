const mongoose = require('mongoose');
const users = require('./users.models');
const Schema = mongoose.Schema;

const valoracionSchema = new Schema({
    usuario_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    valorado_por: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    comentario: { type: String, required: false },
}, { timestamps: true });


const Valoracion = mongoose.model('Valoracion', valoracionSchema);

module.exports = Valoracion;