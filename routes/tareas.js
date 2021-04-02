const express = require('express');
const router = express.Router();

//Controlador
const tareaController = require('../controllers/tareaController');

//El middleware de la autenticacion
const auth = require('../middleware/auth');

//Para chequear parametros en la peticion al server.
const { check } = require('express-validator');

//Creando una tarea
//api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'La tarea debe de poseer una descripción.').not().isEmpty(),
        check('proyecto', 'Debe de existir el proyecto para agregar una tarea.').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Filtrando y listando las tareas por proyecto.
router.get('/',
    auth,
    tareaController.listarTareas
);

//Actualizar una tarea
router.put('/:id',
    auth,
    tareaController.actualizarTarea
)

//Elimnar una tarea por su id
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;