//Rutas para crear usuarios.
const express = require('express');     //Llamando a el server de express.
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Crea un usuario
//endpoint: /api/usuarios.
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

module.exports = router;