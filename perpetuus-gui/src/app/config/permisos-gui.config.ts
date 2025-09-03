import { DeepValues } from '../utiles/tipos-personalizados';

export const PERMISOS_DISPONIBLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    MENU: {
        _ADMIN: 'MENU.ADMIN',
        ADMIN: {
            ROL: 'MENU.ADMIN.ROLES',
            USUARIO: 'MENU.ADMIN.USUARIO',
            PARAMETROS: 'MENU.ADMIN.PARAMETROS',
            AREAS: 'MENU.ADMIN.AREAS',
            FLUJOS: 'MENU.ADMIN.FLUJOS',
            _ALMACENES: 'MENU.ADMIN.ALMACENES',
            ALMACENES: {
                ADMINISTRAR: 'MENU.ADMIN.ALMACENES.ADMINSITRAR',
                ARTICULOS: 'MENU.ADMIN.ALMACENES.ARTICULOS'
            }
        }
    },
    ROL: {
        CREAR: 'ROL.CREAR',
        OBTENER: 'ROL.OBTENER',
        MODIFICAR: 'ROL.MODIFICAR',
        ACTIVAR_DESACTIVAR: 'ROL.ACTIVAR_DESACTIVAR',
        PERMISO: {
            AGREGAR: 'ROL.PERMISO.AGREGAR',
            OBTENER: 'ROL.PERMISO.OBTENER',
            ELIMINAR: 'ROL.PERMISO.ELIMINAR'
        }
    },
    USUARIO: {
        CREAR: 'USUARIO.CREAR',
        OBTENER: 'USUARIO.OBTENER',
        MODIFICAR: 'USUARIO.MODIFICAR',
        ACTIVAR_DESACTIVAR: 'USUARIO.ACTIVAR_DESACTIVAR',
        ROL: {
            AGREGAR: 'USUARIO.ROL.AGREGAR',
            ELIMINAR: 'USUARIO.ROL.ELIMINAR'
        }
    }
} as const;

export type PERMISOS_PERPETUUS = DeepValues<
    typeof PERMISOS_DISPONIBLES,
    string
>;

export type PERMISOS_MENU_PERPETUUS = DeepValues<
    typeof PERMISOS_DISPONIBLES.MENU,
    string
>;
