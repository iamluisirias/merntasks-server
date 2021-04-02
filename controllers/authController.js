const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    
    //Validaremos si hay errores 
    const errores = validationResult(req);

    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraemos el email y password 
    const { email, password } = req.body;

    try {
        //Revisar que sea un usuario registrado.
        let usuario = await Usuario.findOne({ email })  //Vamos a encontrar un usuario por su email.

        //Si el usuario no existe
        if (!usuario) {
            return res.status(400).json({msg: "sos boludo, no hay una cuenta registrada con ese email"})
        }

        //Si no se cumple lo anterior, entonces se procede a revisar la password
        //Se compara la contraseña del request con la del usaurio que se acaba de crear.
        const passCorrecto = await bcryptjs.compare(password, usuario.password)
        
        if (!passCorrecto) {
            return res.status(400).json({"msg": "Password incorrecto"})
        }

        //Si todo es corecto, se produce a crear el JWT
        //Creando el JWT
        const payload = { 
            usuario: {
                id: usuario.id
            }
        }

        //Firmando el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({ token })
        })

    } catch (error) {
        console.log(error);
    }

}

//Funcion para obtener el usuario autenticado
exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');         //Viene del auth del middleware.
        res.json(usuario);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor' })
    }
}