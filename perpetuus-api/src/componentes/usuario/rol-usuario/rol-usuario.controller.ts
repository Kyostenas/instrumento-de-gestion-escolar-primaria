import { Request, Response } from 'express';
import { syslog as _syslog } from '../../../utils/logs.utils';

import { Rol, ROL_MODEL } from '../rol-usuario/rol-usuario.model';
import { RolService } from './rol-usuario.service';

import { Resp } from '../../../utils/response.utils';
import { NOMBRE_ROL_SUPER_ADMIN } from '../../../utils/constantes.utils';
import { CRUD_Controller } from '../../../abstract-classes/crud/crud-controller.abstract';
import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { validar_existencia_de_campos } from '../../../utils/validaciones.utils';

export class RolController extends CRUD_Controller<typeof ROL_MODEL> {
    getmodel(): ReturnModelType<typeof Rol, BeAnObject> {
        return ROL_MODEL;
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
            extra_body: BODY,
            operation: new RolService().create,
            res_message: 'Rol creado',
            err_message: 'Error al crear rol',
            is_creation: true,
            filename: __filename,
            fields_to_validate: {
                extra_body: ['nombre', 'description', 'user_id']
            }
        });
    };
    read = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        const BODY = req.query;
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().read,
            res_message: 'Se obtuvieron todos los roles',
            err_message: 'Error al crear rol',
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
            extra_body: req.params,
            operation: new RolService().read_by_sequence,
            res_message: 'Rol obtenido usando un consecutivo',
            err_message: 'Error al obtener un rol con su consecutivo',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: { extra_body: ['sequence'] }
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
                mensaje: `No se puede modificar el rol de ${NOMBRE_ROL_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().update,
            res_message: 'Rol modificado',
            err_message: 'Error al modificar un rol',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: {
                extra_body: ['nombre', 'description', 'sequence', 'user_id']
            }
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
                mensaje: `No se puede modificar el rol de ${NOMBRE_ROL_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().activate,
            res_message: 'Rol activado',
            err_message: 'Error al activar un rol',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: { extra_body: ['sequence', 'user_id'] }
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
                mensaje: `No se puede modificar el rol de ${NOMBRE_ROL_SUPER_ADMIN}`
            })._403_forbidden();
        }
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().deactivate,
            res_message: 'Rol desactivado',
            err_message: 'Error al desactivar un rol',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: { extra_body: ['sequence', 'user_id'] }
        });
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CRUD
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region EXTRA-ACTIONS
    // (o-----------------------------------------------------------\/-----o)

    add_permissions_to_rol = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        validar_existencia_de_campos(['sequence'], req.params);
        const rol = await new RolService().read_by_sequence({
            sequence: Number(req.params.sequence)
        });
        const BODY = {
            ...req.body,
            ...req.params,
            user_id: req.usuario?._id,
            rol
        };
        // const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        // if (!!SUPER_ADMIN) {
        //     return new Resp(res, __filename, {
        //         mensaje: `No se puede modificar el rol de ${NOMBRE_ROL_SUPER_ADMIN}`,
        //     })._403_forbidden();
        // }
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().crear_permisos_en_rol,
            res_message: 'Permiso/s agregado/s a rol',
            err_message: 'Hubo un error agregando permisos al rol',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: {
                extra_body: ['permissions', 'rol', 'user_id']
            }
        });
    };

    remove_permissions_from_rol = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        validar_existencia_de_campos(['sequence'], req.params);
        const rol = new RolService().read_by_sequence({
            sequence: Number(req.params.sequence)
        });
        const BODY = {
            ...req.body,
            ...req.params,
            user_id: req.usuario?._id,
            rol
        };
        // const SUPER_ADMIN = this.test_if_super_admin(BODY.sequence);
        // if (!!SUPER_ADMIN) {
        //     return new Resp(res, __filename, {
        //         mensaje: `No se puede modificar el rol de ${NOMBRE_ROL_SUPER_ADMIN}`,
        //     })._403_forbidden();
        // }
        return this.try_operation({
            res,
            req,
            extra_body: BODY,
            operation: new RolService().eliminar_permisos_en_rol,
            res_message: 'Permiso/s eliminado/s del rol',
            err_message: 'Hubo un error eliminando permisos del rol',
            not_found_message: 'No existe un rol con ese consecutivo',
            is_creation: false,
            filename: __filename,
            fields_to_validate: {
                extra_body: ['permissions', 'rol', 'user_id']
            }
        });
    };

    creat_superadmin_rol = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            operation: new RolService().crear_rol_super_admin,
            res_message: `Rol de ${NOMBRE_ROL_SUPER_ADMIN} creado`,
            err_message: `Error al crear el rol de ${NOMBRE_ROL_SUPER_ADMIN}`,
            is_creation: false,
            filename: __filename
        });
    };

    get_permissions = async (
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> => {
        return this.try_operation({
            res,
            req,
            operation: new RolService().obtener_permisos_disponibles,
            res_message: `Rol de ${NOMBRE_ROL_SUPER_ADMIN} creado`,
            err_message: `Error al crear el rol de ${NOMBRE_ROL_SUPER_ADMIN}`,
            is_creation: false,
            filename: __filename
        });
    };

    private test_if_super_admin = async (sequence: number) => {
        const ROL = await this.getmodel().findOne({ sequence }).lean();
        return ROL?.super_admin;
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion EXTRA-ACTIONS
    // (o==================================================================o)
}
