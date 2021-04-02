const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,            //Para referenciar al Schema del proyecto al que pertenece.
        ref: 'Proyecto'                                  //Nombre del modelo a referenciar.
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);