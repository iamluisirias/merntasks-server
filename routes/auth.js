//Rutas para autenticar usuarios
const express = require('express');     //Llamando a el server de express.
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//Autenticar un un usuario
//endpoint: /api/auth.
router.post('/', 
    authController.autenticarUsuario
);

//hacer un get a /api/auth devolvera el usuario autenticado
router.get('/',
    auth,
    authController.obtenerUsuario
);

module.exports = router;