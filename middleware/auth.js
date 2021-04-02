const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Vamos a leer el token del header
    const token = req.header('x-auth-token');
    //console.log(token);

    //Revisar si no hay token 
    if (!token) {
        return res.status(401).json({msg: 'No hay token, permiso no concedido.'})
    }

    //Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);  //Verifica el token y la palabra para "desencriptarlo".
        req.usuario = cifrado.usuario;                           //Agregamos una nueva parte al request, en el payload ya se crea un usuario, por eso el cifrado.usuario.
        next()                                                   //Para que se vaya al siguiente middleware.   
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'})
    }
}