import { Rol } from '../../componentes/usuario/rol-usuario/rol-usuario.model';
import { USER_MODEL } from '../../componentes/usuario/usuario/usuario.model';
import {
    PERMISOS_DISPONIBLES,
    PERMISOS_MENU_PERPETUUS,
    PERMISOS_PERPETUUS
} from '../../config/roles/permisos-api.config';
import { DocumentType } from '@typegoose/typegoose';

// (o==================================================================o)
//   #region OBTENCIOIN DE LOS MENUS (INICIO)
// (o-----------------------------------------------------------\/-----o)

/**
 * Obtener los menus que el usuario podra ver en su barra lateral,
 * basandose en sus permisos.
 *
 * Es una funcion recursiva porque los menus pueden tener sub-menus.
 *
 * @param [id_usuario] El id del usuario que esta haciendo login
 * @param [menus] Los menus a evaluar. Esto es para la recursion.
 */
async function obtener_menus(id_usuario: any, menus: DESCRIPCION_MENU[]) {
    const usuario = await USER_MODEL.findById(id_usuario)
        .select('-__v -contrasena -rfrsh_tkn_validity -rfrsh_tkn')
        .populate<{ rol: DocumentType<Rol> }>('rol')
        .lean();
    let menus_enviar: DESCRIPCION_MENU[] = [];
    const PERMISOS_USUARIO: PERMISOS_PERPETUUS[] = usuario?.rol?.permisos ?? [];
    for (let iMenu = 0; iMenu < menus.length; iMenu++) {
        let UN_MENU = menus[iMenu];
        if (!!UN_MENU.sub_menus) {
            const SUB_MENUS = await obtener_menus(usuario, UN_MENU.sub_menus);
            if (SUB_MENUS.length === 0) {
                UN_MENU.sub_menus = undefined;
            } else {
                UN_MENU.sub_menus = SUB_MENUS;
            }
        }
        let incluir = false;
        if (UN_MENU.permiso === 'LIBRE') {
            incluir = true;
        } else if (PERMISOS_USUARIO.includes(UN_MENU.permiso)) {
            incluir = true;
        }
        if (incluir) {
            menus_enviar.push(UN_MENU);
        }
    }
    return menus_enviar;
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion OBTENCIOIN DE LOS MENUS (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region LISTA DE TODOS LOS MENUS (INICIO)
// (o-----------------------------------------------------------\/-----o)

/**
 * Todos los menus existentes. Esto se manda a la GUI para generar
 * la barra lateral, basandose en los permisos que tienen el usuario.
 */
const MENUS: DESCRIPCION_MENU[] = [
    {
        nombre: 'Dashboard',
        simbolo: 'bi bi-bar-chart',
        link: 'dashboard',
        ruta_completa: 'dashboard',
        permiso: 'LIBRE',
        es_sub_menu: false,
        nivel: 0
    },
    {
        nombre: 'Panel Administrador',
        simbolo: 'bi bi-person-gear',
        link: 'panel-administrador',
        ruta_completa: 'panel-administrador',
        permiso: PERMISOS_DISPONIBLES.MENU._ADMIN,
        es_sub_menu: false,
        nivel: 0,
        sub_menus: [
            {
                nombre: 'Roles',
                simbolo: 'bi bi-person-lines-fill',
                link: 'roles',
                ruta_completa: 'panel-administrador/roles',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN.ROL,
                es_sub_menu: true,
                nivel: 1
            },
            {
                nombre: 'Usuarios',
                simbolo: 'bi bi-person-circle',
                link: 'usuarios',
                ruta_completa: 'panel-administrador/usuarios',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN.USUARIO,
                es_sub_menu: true,
                nivel: 1
            },
            {
                nombre: 'Parámetros',
                simbolo: 'bi bi-sliders',
                link: 'parametros',
                ruta_completa: 'panel-administrador/parametros',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN.PARAMETROS,
                es_sub_menu: true,
                nivel: 1
            },
            {
                nombre: 'Áreas',
                simbolo: 'bi bi-building',
                link: 'areas',
                ruta_completa: 'panel-administrador/areas',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN.AREAS,
                es_sub_menu: true,
                nivel: 1
            },
            {
                nombre: 'Flujos',
                simbolo: 'bi bi-arrow-left-right',
                link: 'flujos',
                ruta_completa: 'panel-administrador/flujos',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN.FLUJOS,
                es_sub_menu: true,
                nivel: 1
            },
            {
                nombre: 'Almacenes',
                simbolo: 'bi bi-boxes',
                link: 'almacenes',
                ruta_completa: 'panel-administrador/almacenes',
                permiso: PERMISOS_DISPONIBLES.MENU.ADMIN._ALMACENES,
                es_sub_menu: true,
                nivel: 1,
                sub_menus: [
                    {
                        nombre: 'Control Almacenes',
                        simbolo: 'bi bi-box2',
                        link: 'administrar',
                        ruta_completa:
                            'panel-administrador/almacenes/administrar',
                        permiso:
                            PERMISOS_DISPONIBLES.MENU.ADMIN.ALMACENES
                                .ADMINISTRAR,
                        es_sub_menu: true,
                        nivel: 2
                    },
                    {
                        nombre: 'Control Artículos',
                        simbolo: 'bi bi-stack',
                        link: 'articulos',
                        ruta_completa:
                            'panel-administrador/almacenes/articulos',
                        permiso:
                            PERMISOS_DISPONIBLES.MENU.ADMIN.ALMACENES.ARTICULOS,
                        es_sub_menu: true,
                        nivel: 2
                    }
                ]
            }
        ]
    }
];

/**
 * La composicion de la descripcion de una entrada del menu que se
 * envia a la GUI para la barra lateral.
 */

interface DESCRIPCION_MENU {
    nombre: string;
    simbolo: string;
    link: string;
    ruta_completa: string;
    permiso: PERMISOS_MENU_PERPETUUS | 'LIBRE';
    es_sub_menu: boolean;
    nivel: number;
    descripcion?: string;
    sub_menus?: DESCRIPCION_MENU[];
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion LISTA DE TODOS LOS MENUS (FIN)
// (o==================================================================o)

export { obtener_menus, MENUS, DESCRIPCION_MENU };
