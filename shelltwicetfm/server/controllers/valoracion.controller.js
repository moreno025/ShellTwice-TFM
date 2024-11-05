const Users = require('../models/users.models.js');
const Valoracion = require('../models/valoraciones.models.js');

// POST para añadir una valoración
exports.anadirValoracion = async (req, res) => {
    const { usuarioId, valoradoPor, calificacion, comentario } = req.body;

    try {
        const nuevaValoracion = new Valoracion({
            usuario_id: usuarioId,
            valorado_por: valoradoPor,
            calificacion,
            comentario
        });

        await nuevaValoracion.save();
        res.status(201).json(nuevaValoracion);
    } catch (error) {
        console.error("Error al añadir la valoración:", error);
        res.status(500).json({ message: 'Error al añadir la valoración' });
    }
};

// GET para sacar la valoracion de un user
exports.getValoracion = async (req, res) => {
    const usuarioId = req.user._id;
    try {
        const valoraciones = await Valoracion.find({ usuario_id: usuarioId })
            .populate('valorado_por', 'username')
            .exec();

        if (valoraciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron valoraciones para este usuario.' });
        }

        res.status(200).json(valoraciones);
    } catch (error) {
        console.error("Error al obtener valoraciones:", error);
        res.status(500).json({ message: 'Error al obtener valoraciones' });
    }
};

// GET para la valoración media de un usuario
exports.getMediaValoracion = async (req, res) => {
    const usuarioId = req.user._id;

    try {
        const valoraciones = await Valoracion.find({ usuario_id: usuarioId });
        
        if (valoraciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron valoraciones para este usuario.' });
        }

        const suma = valoraciones.reduce((acc, valoracion) => acc + valoracion.calificacion, 0);
        const media = suma / valoraciones.length;

        res.status(200).json({ media });
    } catch (error) {
        console.error("Error al calcular la media de valoraciones:", error);
        res.status(500).json({ message: 'Error al calcular la media de valoraciones' });
    }
};





