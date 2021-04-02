const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,       //El tipo del que será el dato.
        required: true,     //Es requerido.
        trim: true          //Para eliminar espacios en balnco antes de hacer el registro en la bd.
    },

    email: {
        type: String,       //El tipo del que será el dato.
        required: true,     //Es requerido.
        trim: true,         //Para eliminar espacios en balnco antes de hacer el registro en la bd.
        unique: true        //Que sea el unico email asociado, no tienen que haber dos o mas registros con el mismo email.
    },

    password: {
        type: String,       //El tipo del que será el dato.
        required: true,     //Es requerido.
        trim: true          //Para eliminar espacios en balnco antes de hacer el registro en la bd.
    },

    registro: {
        type: Date,         //El tipo del que será el dato.
        default: Date.now() //Fecha para el momento en el que se hace el registro
    }
})

module.exports = mongoose.model('Usuario', UsuarioSchema);