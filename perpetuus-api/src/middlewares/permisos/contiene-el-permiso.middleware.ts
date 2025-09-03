import guard from 'express-jwt-permissions';
guard({
    requestProperty: 'usuarios',
    permissionsProperty: 'permisos'
});

import { USER_MODEL } from '../../componentes/usuario/usuario/usuario.model';
import { PERMISOS_DISPONIBLES } from '../../config/roles/permisos-api.config';

import { Request, Response } from 'express';
import { controlador_auth } from '../../componentes/auth-login/auth.controller';
import { seleccionarCampoCualquierNivelProfundo } from '../../utils/general.utils';
import { DocumentType } from '@typegoose/typegoose';
import { Rol } from '../../componentes/usuario/rol-usuario/rol-usuario.model';

export const PERMISOS = PERMISOS_DISPONIBLES;

/**
 * Comprueba si un usuario tiene un permiso, basado en su rol.
 *
 * @param [permiso] La cadena de texto que representa al permiso.
 * @param [middleware=false] Si es true, se retorna el check del guard, si
 *      es false, se retorna una comprobacion directa sobre el arreglo
 *      de permisos del usuario.
 * @param [req] Opcionalmente se puede pasar el request para cundo la
 *      opcion `middleware` es false.
 * @param [res] Opcionalmente se puede pasar el response para cundo la
 *      opcion `middleware` es false.
 * @param [next] Opcionalmente se puede pasar el next para cundo la
 *      opcion `middleware` es false.
 * @returns El `RequestHandler` o un booleano, dependiendo de la opcion `middleware`.
 */
export function tiene_permiso(
    permiso: string,
    // middleware: boolean = true,
    req?: Request,
    res?: Response,
    next?: any
) {
    const EXISTE_PERMISO = seleccionarCampoCualquierNivelProfundo(
        PERMISOS_DISPONIBLES,
        permiso,
        '.'
    );
    if (!EXISTE_PERMISO) throw `No existe el permiso: ${permiso}`;

    const comprobacion_permiso = async function (
        req: Request,
        res: Response,
        next: any
    ) {
        const ID_ROL = req.usuario?.rol;
        const ID_USUARIO = req.usuario?._id;
        if (!req.usuario) {
            next('No se encontró la sesión del usuario');
            return;
        }
        if (!ID_ROL) {
            await controlador_auth.cerrar_sesion(
                req,
                res,
                'Se ha forzado el cierre de sesión porque el usuario no tiene un rol asignado'
            );
        }
        const USUARIO = await USER_MODEL.findOne({ _id: ID_USUARIO })
            .select('rol')
            .populate<{ rol: DocumentType<Rol> }>('rol')
            .lean();
        const ROL = USUARIO?.rol;
        if (!USUARIO) {
            await controlador_auth.cerrar_sesion(
                req,
                res,
                'Se ha forzado el cierre de sesión porque no se encuentra el usuario'
            );
        }
        if (String(ID_ROL) !== String(ROL?._id)) {
            await controlador_auth.cerrar_sesion(
                req,
                res,
                'Se ha forzado el cierre de sesión porque se detecto un cambio no autorizado del rol del usuario'
            );
        }
        req.usuario.permisos = ROL?.permisos || [];
        req.permiso_denegado = permiso;

        // if (middleware) {
        return guard({
            requestProperty: 'usuario',
            permissionsProperty: 'permisos'
        }).check(permiso)(req, res, next);
        // } else {
        //     return req.usuario.permisos.includes(permiso)
        // }
    };

    return comprobacion_permiso;

    // return middleware? comprobacion_permiso : comprobacion_permiso(
    //     <Request>req, <Response>res, next
    // )
}
