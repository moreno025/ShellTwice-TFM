const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    //profilePicture: {  },
    rol: {
        type: Number, 
        required: true, 
        enum: [0, 1],
        default: 1
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const users = mongoose.model('users', userSchema);

module.exports = users;