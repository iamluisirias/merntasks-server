const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    
    //Validaremos si hay errores 
    const errores = validationResult(req);

    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Aplicando destructuring para extraer el email y la contraseña.
    const { email, password } = req.body; 

    try {

        //Vamos a revisar que el email que se ha ingresado no hay sido utilizado previamente en otro registro.
        let usuario = await Usuario.findOne({ email });

        //Si ya existe un usuario con ese email retornamos un mensaje avisando de esto
        if (usuario) {
            return res.status(400).json({ msg: 'Ya se ha registrado un usuario con ese correo electronico.' });
        }

        //Creando el nuevo usuario.
        usuario = new Usuario(req.body);    //req.body es para acceder a los datos.

        //Despues de instanciar el usuario vamos a hashear la contraseña.
        const salt = await bcryptjs.genSalt(10);      //El salt es para generar una encriptacion idtatintapara dos contraseñas iguales.
        usuario.password = await bcryptjs.hash(password, salt);  //Parametros: el string a hashear y el salt.

        //Guardando el nuevo usuario
        await usuario.save();

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
            return res.json({ token })
        })
        

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error.');                   
    }
}