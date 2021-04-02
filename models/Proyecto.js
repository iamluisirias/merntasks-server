const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,                //Para hacer referencia al id.
        ref: "Usuario"                                       //Para saber exactamente a que esta haciendo referencia, en este caso el Schema del usuario   
    },
    creado: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Proyecto', ProyectoSchema)