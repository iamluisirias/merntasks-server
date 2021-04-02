const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crea proyecto
// /api/proyectos
router.post('/',
    auth,     //Express funciona de manera que primero revisa todo lo qu esta dentro de auth para luego pasar al siguiente middleware, o sea el controlador de proyecto.
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
)

//Obtener todos los proyectos creados por el usuario.
router.get('/',
    auth,     //Express funciona de manera que primero revisa todo lo qu esta dentro de auth para luego pasar al siguiente middleware, o sea el controlador de proyecto.
    proyectoController.obtenerProyectos
)

//Actualizar un proyecto ya creado via ID.
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)

//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)

module.exports = router;