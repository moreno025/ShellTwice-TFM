const mongoose = require('mongoose');
require('dotenv').config();
const Articulo = require('./models/articulo.models.js');
const Users = require('./models/users.models.js');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGO_DB_NAME
        });
        console.log('Connected to DB');

        const usersCount = await Users.countDocuments();
        const articulosCount = await Articulo.countDocuments();

        console.log(`Users count: ${usersCount}`);
        console.log(`Articulos count: ${articulosCount}`);

        if (articulosCount > 0) {
            const articulos = await Articulo.find().limit(5);
            console.log('Semple Articulos:', JSON.stringify(articulos, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verify();
