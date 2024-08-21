const mongoose = require('mongoose');
const Articulo = require('./articulo.models');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    //profilePicture: {  },
    rol: {
        type: Number, 
        required: true, 
        enum: [0, 1],
        default: 1
    },
    estado: { type: String, enum: ["Bloqueado", "Activo"], default: "Activo" },
    favoritos: [{ type: Schema.Types.ObjectId, ref: 'Articulo' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const users = mongoose.model('users', userSchema);

module.exports = users;