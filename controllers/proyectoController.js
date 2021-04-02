const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const { request } = require('express');

exports.crearProyecto = async (req, res) => {

    //Validar si los campos son validos
    const errores = validationResult(req);

    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }


    try {
        //Crear un nuevo proyecto.
        const proyecto = new Proyecto(req.body);     //Como solo es el nombre de lo que se compone un proyecto, le agregamos directamente el valor del body del request.

        //Antes de guardar el proyecto, vamos a agregar el usuario que lo creo via JWT
        proyecto.creador = req.usuario.id;

        //Ahora guardamos el proyecto.
        proyecto.save();
        res.json(proyecto);   
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

//funcion para obtener todos los proyectos creados por el usuario actual.
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });        //Encuentra todo aquel proyecto donde el creador sea el id del usuario que hizo el request.
        res.json({ proyectos });   //Enviamos los proyectos al usuario.          
        
    } catch (error) {
        console.log(error);
        res.send('Hubo un error al obtener los proyectos');
    }
}

//Actualiza un proyecto ya creado
exports.actualizarProyecto = async (req, res) => {
 
    //Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errores: errors.array()
        });
    }
 
    //Extraer la informacion del proyecto
    const {nombre} = req.body;
    const proyectoActualizado = {};
 
    if (nombre) {
        proyectoActualizado.nombre = nombre;
    }
 
    try {
 
        //Revisar el id
        await Proyecto.findById(req.params.id, (err, proyecto) => {
 
            //Si el proyecto existe o no
            if (err || !proyecto) {
                return res.status(404).json({
                    msg: 'Proyecto no encontrado'
                });
            }
 
            //Verificar el creador del proyecto
            if (proyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({
                    msg: 'No Autorizado'
                });
            }
        });
 
        //Actualizar
        let proyectoActualizado = await Proyecto.findByIdAndUpdate(
            {_id: req.params.id}, {$set: proyectoActualizado}, {new: true});
 
        res.json(proyectoActualizado)
 
 
    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error en el servidor');
    }
}

//Funcion para eliminar un proyecto en especifico
exports.eliminarProyecto = async (req, res) => {
    try {
        
        //Revisar el id
        await Proyecto.findById(req.params.id, (err, proyecto) => {
 
            //Si el proyecto existe o no
            if (err || !proyecto) {
                return res.status(404).json({
                    msg: 'Proyecto no encontrado'
                });
            }
 
            //Verificar el creador del proyecto
            if (proyecto.creador.toString() !== req.usuario.id) {
                return res.status(401).json({
                    msg: 'No Autorizado'
                });
            }
        });

        //Eliminar el proyecto
        const proyecto = await Proyecto.findOneAndRemove({  _id: req.params.id })//.sort({ creado: -1 });        //Encuentra todo aquel proyecto donde el creador sea el id del usuario que hizo el request.
        res.json({ msg: "Proyecto eliminado con exito" });   //Enviamos los proyectos al usuario.          
        
    } catch (error) {
        console.log(error);
        res.send('Hubo un error al tratar de eliminar el proyecto.');
    }
}
