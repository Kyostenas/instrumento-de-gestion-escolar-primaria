import { Request, Response } from 'express';

import { Resp } from '../../utils/response.utils';

import { USER_MODEL } from '../../componentes/usuario/usuario/usuario.model';

function problemas_usuario(res: Response, problemas: string[]) {
    return new Resp(res, __filename, {
        mensaje: `Error: ${problemas.join(', ')}`
    })._400_badRequest();
}

async function usuario_correo_duplicado(
    req: Request,
    res: Response,
    next: any
) {
    try {
        let problemas: string[] = [];

        // Usuario
        let usuario_nombre_usuario = await USER_MODEL.find({
            nombre_usuario: req.body.nombre_usuario
        });
        if (usuario_nombre_usuario.length > 0) {
            problemas.push('nombre de usuario ocupado');
        }

        // Correo
        if (req.body.correo) {
            let usuario_correo = await USER_MODEL.find({
                correo: req.body.correo
            });
            if (usuario_correo.length > 0) {
                problemas.push('correo ocupado');
            }
        }

        // Numero celular
        if (req.body.numero_celular) {
            let usuario_numero_celular = await USER_MODEL.find({
                $and: [
                    { numero_celular: req.body.numero_celular },
                    { numero_celular: { $exists: true } }
                ]
            });
            if (usuario_numero_celular.length > 0) {
                problemas.push('número de celular ocupado');
            }
        }

        if (problemas.length > 0) return problemas_usuario(res, problemas);

        // Correcto
        next();
    } catch (error) {
        return new Resp(res, __filename, {
            mensaje: 'No se pudo validar usuario',
            error: error
        })._500_internal_server_error();
    }
}

const auth_middleware = {
    usuario_correo_duplicado
};

export { auth_middleware };
