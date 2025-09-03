import { Request, Response } from 'express';

import { Resp } from '../../utils/response.utils';

import { servicio_auth } from './auth.service';

import { USER_MODEL } from '../usuario/usuario/usuario.model';
import { MENUS, obtener_menus } from '../../services/menu/menu.service';
import { Rol } from '../usuario/rol-usuario/rol-usuario.model';
import { DocumentType } from '@typegoose/typegoose';
import { UserController } from '../usuario/usuario/usuario.controller';

async function registrar_usuario(req: Request, res: Response) {
    new UserController().create(req, res);
}

async function iniciar_sesion(req: Request, res: Response) {
    try {
        const USUARIO = await USER_MODEL.findOne({
            nombre_usuario: req.body.nombre_usuario
        });
        if (!USUARIO) {
            return new Resp(res, __filename, {
                mensaje: 'Usuario o contraseña incorrectos'
            })._401_unauthorized();
        }

        const { contrasena_valida, token_generado } =
            servicio_auth.generar_token_inicio_sesion(
                USUARIO,
                req.body.contrasena
            );
        if (!contrasena_valida) {
            return new Resp(res, __filename, {
                mensaje: 'Usuario o contraseña incorrectos'
            })._401_unauthorized();
        } else {
            // Crear refresh token
            await servicio_auth.crear_refresh_token(USUARIO);
        }

        // Agregar token a la sesion
        if (!req.session) throw 'No hay sesión';
        req.session.token = token_generado;

        const usuario_enviar = await USER_MODEL.findById(USUARIO._id)
            .select('-__v -contrasena -rfrsh_tkn_validity -rfrsh_tkn')
            .populate<{ rol: DocumentType<Rol> }>('rol')
            .lean();
        // let usuario_enviar = await USER_MODEL
        //     .findOne({_id: USUARIO._id})

        //     .populate<{rol: DocumentType<Rol>}('rol')
        //     .lean();
        let menu_usuario = await obtener_menus(usuario_enviar?._id, MENUS);
        // delete USUARIO.rol?.permisos
        // delete USUARIO.rol?.__v
        let nombre_completo = `${USUARIO.nombres} ${USUARIO.apellidos}`;
        return new Resp(res, __filename, {
            mensaje: `¡Hola de nuevo! ${nombre_completo}`,
            datos: {
                usuario: usuario_enviar,
                menus: menu_usuario
            }
        })._200_ok();
    } catch (error) {
        return new Resp(res, __filename, {
            mensaje: 'Error al iniciar sesión',
            error
        })._422_unprocessable();
    }
}

async function refrescar_inicio_sesion(req: Request, res: Response) {
    try {
        const usuario = await USER_MODEL.findOne({
            nombre_usuario: req.usuario?._id
        });
        const refresh_token = String(req.params.rfrsh_tkn);
        if (!usuario) {
            return new Resp(res, __filename, {
                mensaje: 'Usuario inexistente'
            })._401_unauthorized();
        }
        const { debe_iniciar_de_nuevo, token_generado } =
            await servicio_auth.refrescar_token_inicio_sesion(
                usuario,
                refresh_token
            );

        if (!debe_iniciar_de_nuevo) {
            return new Resp(res, __filename, {
                mensaje: 'Es necesario que inicies sesión de nuevo'
            })._401_unauthorized();
        } else {
            // Agregar token a la sesion
            if (!req.session) throw 'No hay sesión';
            req.session.token = token_generado;
            let nombre_completo = `${usuario.nombres} ${usuario.apellidos}`;
            return new Resp(res, __filename, {
                mensaje: `Sesión renovada`
            })._200_ok();
        }
    } catch (error) {
        return new Resp(res, __filename, {
            mensaje: 'Error al renovar sesión',
            error
        })._422_unprocessable();
    }
}

async function cerrar_sesion(
    req: Request,
    res: Response,
    mensaje = 'Hasta pronto...'
) {
    try {
        res.clearCookie('perpetuus-session');
        res.clearCookie('perpetuus-session.sig');
        return new Resp(res, __filename, { mensaje })._200_ok();
    } catch (error) {
        // todo: ¿Usar this.next(error)?

        return new Resp(res, __filename, {
            mensaje: 'Error al cerrar sesión',
            error
        })._422_unprocessable();
    }
}

async function validar_sesion(req: Request, res: Response) {
    try {
        const { sesion_valida } = servicio_auth.validar_sesion(req);

        if (!sesion_valida) {
            return new Resp(res, __filename, {
                mensaje: 'Es necesario que inicies sesión de nuevo'
            })._401_unauthorized();
        } else {
            return new Resp(res, __filename, {
                mensaje: `Sesión existente`,
                datos: sesion_valida
            })._200_ok();
        }
    } catch (error) {
        return new Resp(res, __filename, {
            mensaje: 'Error al validar la sesión',
            error
        })._422_unprocessable();
    }
}

const controlador_auth = {
    registrar_usuario,
    iniciar_sesion,
    refrescar_inicio_sesion,
    cerrar_sesion,
    validar_sesion
};

export { controlador_auth };
