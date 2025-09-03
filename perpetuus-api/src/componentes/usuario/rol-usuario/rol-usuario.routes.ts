import { Router, Request, Response } from 'express';
import {
    tiene_permiso,
    PERMISOS
} from '../../../middlewares/permisos/contiene-el-permiso.middleware';
import { RolController } from './rol-usuario.controller';

const RUTA_ROL = () => {
    const router = Router();

    // (o-----------------------------------------( CRUD ))

    router.post(
        '/',
        tiene_permiso(PERMISOS.ROL.CREAR),
        async (req: Request, res: Response) => {
            return await new RolController().create(req, res);
        }
    );
    router.get(
        '/',
        tiene_permiso(PERMISOS.ROL.OBTENER),
        async (req: Request, res: Response) => {
            return await new RolController().read(req, res);
        }
    );
    router.get(
        '/sequence/:sequence',
        tiene_permiso(PERMISOS.ROL.OBTENER),
        async (req: Request, res: Response) => {
            return await new RolController().read_by_sequence(req, res);
        }
    );

    router.put(
        '/',
        tiene_permiso(PERMISOS.ROL.MODIFICAR),
        async (req: Request, res: Response) => {
            return await new RolController().update(req, res);
        }
    );
    router.put(
        '/activate/sequence/:sequence',
        tiene_permiso(PERMISOS.ROL.ACTIVAR_DESACTIVAR),
        async (req: Request, res: Response) => {
            return await new RolController().activate(req, res);
        }
    );
    router.put(
        '/deactivate/sequence/:sequence',
        tiene_permiso(PERMISOS.ROL.ACTIVAR_DESACTIVAR),
        async (req: Request, res: Response) => {
            return await new RolController().deactivate(req, res);
        }
    );

    // (o-----------------------------------------( ACCIONES EXTRA ))

    // PERMISOS
    router.get(
        '/permisos',
        tiene_permiso(PERMISOS.ROL.PERMISO.OBTENER),
        async (req: Request, res: Response) => {
            return await new RolController().get_permissions(req, res);
        }
    );
    router.put(
        '/permisos/sequence/:sequence',
        tiene_permiso(PERMISOS.ROL.PERMISO.AGREGAR),
        async (req: Request, res: Response) => {
            return await new RolController().add_permissions_to_rol(req, res);
        }
    );
    router.put(
        '/permisos/sequence/:sequence',
        tiene_permiso(PERMISOS.ROL.PERMISO.ELIMINAR),
        async (req: Request, res: Response) => {
            return await new RolController().remove_permissions_from_rol(
                req,
                res
            );
        }
    );

    // SUPER ADMIN
    router.post('/super-admin', async (req: Request, res: Response) => {
        return await new RolController().creat_superadmin_rol(req, res);
    });

    return router;
};

export { RUTA_ROL };
