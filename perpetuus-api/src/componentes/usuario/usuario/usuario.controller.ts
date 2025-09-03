import { Request, Response } from 'express';

import { User, USER_MODEL } from './usuario.model';

import { UserService } from './usuario.service';
import { Resp } from '../../../utils/response.utils';
import { NOMBRE_USUARIO_SUPER_ADMIN } from '../../../utils/constantes.utils';
import { Rol } from '../rol-usuario/rol-usuario.model';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { CRUD_Controller } from '../../../abstract-classes/crud/crud-controller.abstract';
import { BeAnObject } from '@typegoose/typegoose/lib/types';

export class UserController extends CRUD_Controller<typeof USER_MODEL> {
    getmodel(): ReturnModelType<typeof User, BeAnObject> {
        return USER_MODEL;
    }

    // (o==================================================================o)
    //   #region CRUD
    // (o-----------------------------------------------------------\/-----o)

    create = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, user_id: req.usuario?._id };
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().create,
            res_message: 'Usuario creado',
            err_message: 'Error al crear usuario',
            is_creation: true,
            filename: __filename,
            fields_to_validate: [
                'nombres',
                'apellidos',
                'nombre_usuario',
                'contrasena'
            ]
        });
    };
    read = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            operation: new UserService().read,
            res_message: 'Se obtuvieron todos los usuarios',
            err_message: 'Error al crear usuario',
            is_creation: false,
            filename: __filename
        });
    };
    read_by_sequence = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            body: req.params,
            operation: new UserService().read_by_sequence,
            res_message: 'Usuario obtenido usando un consecutivo',
            err_message: 'Error al obtener un usuario con su consecutivo',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence']
        });
    };
    update = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, ...req.params, user_id: req.usuario?._id };
        const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        if (!!SUPER_ADMIN) {
            return new Resp(res, __filename, {
                mensaje: `No se puede modificar el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().update,
            res_message: 'Usuario modificado',
            err_message: 'Error al modificar un usuario',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence', 'user_id']
        });
    };
    activate = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, ...req.params, user_id: req.usuario?._id };
        const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        if (!!SUPER_ADMIN) {
            return new Resp(res, __filename, {
                mensaje: `No se puede modificar el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().activate,
            res_message: 'Usuario activado',
            err_message: 'Error al activar un usuario',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence', 'user_id']
        });
    };
    deactivate = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, ...req.params, user_id: req.usuario?._id };
        const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        if (!!SUPER_ADMIN) {
            return new Resp(res, __filename, {
                mensaje: `No se puede modificar el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().deactivate,
            res_message: 'Usuario desactivado',
            err_message: 'Error al desactivar un usuario',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence', 'user_id']
        });
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CRUD
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region EXTRA-ACTIONS
    // (o-----------------------------------------------------------\/-----o)

    assign_rol_to_user = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, ...req.params, user_id: req.usuario?._id };
        const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        if (!!SUPER_ADMIN) {
            return new Resp(res, __filename, {
                mensaje: `No se puede modificar el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().assign_rol_to_user,
            res_message: 'Nuevo rol asignado a usuario',
            err_message: 'Error al asignar rol a usuario',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence', 'rol', 'user_id']
        });
    };
    remove_rol_from_user = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = { ...req.body, ...req.params, user_id: req.usuario?._id };
        const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        if (!!SUPER_ADMIN) {
            return new Resp(res, __filename, {
                mensaje: `No se puede modificar el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            body: BODY,
            operation: new UserService().remove_rol_from_user,
            res_message: 'Rol removido de usuario',
            err_message: 'Error al remover rol de usuario',
            not_found_message: 'No existe un usuario con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: ['sequence', 'rol', 'user_id']
        });
    };
    create_super_admin = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            body: req.body,
            operation: new UserService().create_super_admin,
            res_message: `Usuario ${NOMBRE_USUARIO_SUPER_ADMIN} creado`,
            err_message: `Error al crear el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`,
            is_creation: false,
            filename: __filename
        });
    };

    private test_if_super_admin = async (sequence: number) => {
        const ROL = await this.getmodel()
            .findOne({ sequence })
            .populate<{ rol: DocumentType<Rol> }>('rol')
            .lean();
        return ROL?.rol?.super_admin;
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion EXTRA-ACTIONS
    // (o==================================================================o)
}
