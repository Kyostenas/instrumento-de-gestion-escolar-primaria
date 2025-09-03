import { Router, Response, Request } from 'express';
import {
    tiene_permiso,
    PERMISOS
} from '../../../middlewares/permisos/contiene-el-permiso.middleware';
import { UserController } from './usuario.controller';

const RUTA_USUARIO = () => {
    const router = Router();

    // (o-----------------------------------------( CRUD ))

    router.post(
        '/',
        tiene_permiso(PERMISOS.USUARIO.CREAR),
        async (req: Request, res: Response) => {
            return await new UserController().create(req, res);
        }
    );
    router.get(
        '/',
        tiene_permiso(PERMISOS.USUARIO.OBTENER),
        async (req: Request, res: Response) => {
            return await new UserController().read(req, res);
        }
    );
    router.get(
        '/sequence/:sequence',
        tiene_permiso(PERMISOS.USUARIO.OBTENER),
        async (req: Request, res: Response) => {
            return await new UserController().read_by_sequence(req, res);
        }
    );
    router.put(
        '/',
        tiene_permiso(PERMISOS.USUARIO.MODIFICAR),
        async (req: Request, res: Response) => {
            return await new UserController().update(req, res);
        }
    );
    router.put(
        'activate/sequence/:sequence',
        tiene_permiso(PERMISOS.USUARIO.ACTIVAR_DESACTIVAR),
        async (req: Request, res: Response) => {
            return await new UserController().activate(req, res);
        }
    );
    router.put(
        'deactivate/sequence/:sequence',
        tiene_permiso(PERMISOS.USUARIO.ACTIVAR_DESACTIVAR),
        async (req: Request, res: Response) => {
            return await new UserController().deactivate(req, res);
        }
    );

    // (o-----------------------------------------( ACCIONES EXTRA ))

    // ROL
    router.put(
        '/rol',
        tiene_permiso(PERMISOS.USUARIO.ROL.AGREGAR),
        async (req: Request, res: Response) => {
            return await new UserController().assign_rol_to_user(req, res);
        }
    );
    router.put(
        '/rol',
        tiene_permiso(PERMISOS.USUARIO.ROL.ELIMINAR),
        async (req: Request, res: Response) => {
            return await new UserController().remove_rol_from_user(req, res);
        }
    );

    // SUPER ADMIN
    router.post('/super-admin', async (req: Request, res: Response) => {
        return await new UserController().create_super_admin(req, res);
    });

    return router;
};

export { RUTA_USUARIO };
