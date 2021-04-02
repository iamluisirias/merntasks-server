//Importamos el modelo
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');

//Para validar lo que chequeamos en el route.
const { validationResult } = require('express-validator');

//Crear una nueva tarea
exports.crearTarea = async (req, res) => {
    
    //Revisar si hay errores en la peticion
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body; //req.body;         
        const proyectoExistente = await Proyecto.findById(proyecto);

        if ( !proyectoExistente ) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }

        //Revisar si el proyecto actual pertenece al usuario.
        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error en el servidor.');
    }


}

//Obtiene las tareas de un proyecto en concreto.
exports.listarTareas = async (req, res) => {
    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;  //El query se utiliza para leer el params del state.
        const proyectoExistente = await Proyecto.findById(proyecto);

        if ( !proyectoExistente ) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' });
        }

        //Revisar si el proyecto actual pertenece al usuario.
        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'})
        }

        //Mostramos todas las tareas de ese proyecto
        const tareas = await Tarea.find({ proyecto });//.sort({ creado: -1 });      //Encontrar todas las tareas donde el proyecto sea el proyecto que estamos extrayendo de la peticion.
        res.json({ tareas });

        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

//Funcion para actualizar una tarea segun su id.
exports.actualizarTarea = async (req, res) => {
    try {

        //Extraer el proyecto
        const { proyecto, nombre, estado } = req.body;

        // //Primero, vamos a revisar si la tarea existe.
       let tareaExistente = await Tarea.findById(req.params.id);

        if ( !tareaExistente ) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        //Extrayendo el proyecto.
        const proyectoExistente = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario.
        if ( proyectoExistente.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Vamos a crear un objeto con la nueva informacion.
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;  //Este viene del destructuring.
        nuevaTarea.estado = estado;  //Este viene del destructuring.

        //Guardar la tarea actualizada
        tareaExistente = await Tarea.findOneAndUpdate({ _id : req.params.id }, nuevaTarea, { new: true });

        res.json({ tareaExistente });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
}

//Funcion para eliminar una tarea 
exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto
        const { proyecto } = req.query;

        // //Primero, vamos a revisar si la tarea existe.
       let tareaExistente = await Tarea.findById(req.params.id);

        if ( !tareaExistente ) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        //Extrayendo el proyecto.
        const proyectoExistente = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario.
        if ( proyectoExistente.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Ahora vamos a eliminar
        await Tarea.findOneAndDelete({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada con exito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor.');
    }
}