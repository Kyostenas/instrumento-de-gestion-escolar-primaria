import { syslog as _syslog } from '../../../utils/logs.utils';
const syslog = _syslog(module);
import { ROL_MODEL, Rol } from '../rol-usuario/rol-usuario.model';
import { PERMISOS_DISPONIBLES } from '../../../config/roles/permisos-api.config';
import { NOMBRE_ROL_SUPER_ADMIN } from '../../../utils/constantes.utils';
import { CRUD_Service } from '../../../abstract-classes/crud/crud-service.abstract';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject, ReturnModelType } from '@typegoose/typegoose/lib/types';
import DBReadingService from '../../../services/db-reading/db-reading.service';

export class RolService extends CRUD_Service<typeof ROL_MODEL, Rol> {
    getmodel(): ReturnModelType<typeof Rol, BeAnObject> {
        return ROL_MODEL;
    }

    create = async ({
        nombre,
        descripcion,
        user_id
    }: {
        nombre: string;
        descripcion: string;
        user_id: string;
    }): Promise<DocumentType<Rol, BeAnObject>> => {
        const rol_input: Rol = { nombre, description: descripcion };
        const ROL_NUEVO = new (this.getmodel())(rol_input);
        ROL_NUEVO.metadata = {
            user_id,
            description: 'rol creado'
        };
        return await ROL_NUEVO.save();
    };

    read = async ({
        pagination,
        term
    }: {
        pagination: Pagination;
        term: string;
    }): Promise<{
        result: DocumentType<Rol, BeAnObject>[] | Rol[];
        total: number;
        pagination: Pagination;
    }> => {
        const DB_READING_SERVICE = new DBReadingService({
            pagination,
            model: this.getmodel(),
            term
        });
        const RESULT = await DB_READING_SERVICE.smart_read();
        return {
            result: RESULT.result,
            total: RESULT.total,
            pagination: RESULT.pagination
        };
    };

    read_by_sequence = async ({
        sequence
    }: {
        sequence: number;
    }): Promise<DocumentType<Rol, BeAnObject> | Rol | null> => {
        const ROL = await this.getmodel().findOne({ sequence }).lean();
        if (!ROL) throw new Error(`No se encontró el rol #${sequence}`);
        return ROL;
    };

    update = async ({
        sequence,
        nombre,
        descripcion,
        user_id
    }: {
        sequence: number;
        nombre: string;
        descripcion: string;
        user_id: string;
    }): Promise<DocumentType<Rol, BeAnObject> | Rol | null> => {
        this.getmodel().findOneAndUpdate(
            { sequence },
            { nombre, descripcion },
            {
                metadata: {
                    user_id,
                    description: 'rol modificado'
                },
                lean: true
            }
        );
        return await this.read_by_sequence({ sequence });
    };
    activate = async ({
        sequence,
        user_id
    }: {
        sequence: number;
        user_id: string;
    }): Promise<DocumentType<Rol, BeAnObject> | Rol | null> => {
        this.getmodel().findOneAndUpdate(
            { sequence },
            { is_active: true },
            {
                metadata: {
                    user_id,
                    description: 'rol activado'
                },
                lean: true
            }
        );
        return await this.read_by_sequence({ sequence });
    };
    deactivate = async ({
        sequence,
        user_id
    }: {
        sequence: number;
        user_id: string;
    }): Promise<DocumentType<Rol, BeAnObject> | Rol | null> => {
        this.getmodel().findOneAndUpdate(
            { sequence },
            { is_active: false },
            {
                metadata: {
                    user_id,
                    description: 'Rol desactivado'
                },
                lean: true
            }
        );
        return await this.read_by_sequence({ sequence });
    };

    private mensaje_permiso_ya_existe(permiso: string) {
        return `Permiso "${permiso}" ya existe`;
    }

    private mensaje_permiso_no_existe(permiso: string) {
        return `Permiso "${permiso}" no existe`;
    }

    crear_permisos_en_rol = async ({
        permissions,
        rol,
        user_id
    }: {
        permissions: string[];
        rol: Rol;
        user_id?: string;
    }): Promise<{
        mensaje_res: string;
        advertencias: string[] | undefined;
    }> => {
        let creados = 0;
        let existentes = 0;
        let advertencia_pedazos = [];
        let permisos_existentes = rol.permisos;
        let permisos_para_agregar = [];
        let nombres_existentes: String[] = [];
        if (permisos_existentes) {
            nombres_existentes = permisos_existentes.map(
                (un_perm: any) => un_perm
            );
        }
        for (let i_perm = 0; i_perm < permissions.length; i_perm++) {
            const un_permiso_nuevo = permissions[i_perm];
            if (nombres_existentes.includes(un_permiso_nuevo)) {
                existentes += 1;
                let advertencia =
                    this.mensaje_permiso_ya_existe(un_permiso_nuevo);
                syslog.warning(advertencia);
                advertencia_pedazos.push(advertencia);
            } else {
                permisos_para_agregar.push(un_permiso_nuevo);
                creados += 1;
            }
        }
        if (creados > 0) {
            let permisos_totales = [
                ...(rol.permisos ? rol.permisos : []),
                ...permisos_para_agregar
            ];
            await this.getmodel().findOneAndUpdate(
                { _id: rol._id },
                {
                    permisos: permisos_totales
                },
                {
                    metadata: {
                        user_id,
                        description: 'permisos agregados a rol',
                        large_description: `Se agregaron los permisos:\n${permisos_para_agregar.join('\n')}`
                    }
                }
            );
        }
        let advertencias!: string[];
        if (advertencia_pedazos) {
            if (advertencia_pedazos.length > 0) {
                advertencias = advertencia_pedazos;
            }
        }
        return {
            mensaje_res: `${creados} Permisos creados. ${existentes} Ya existen.`,
            advertencias
        };
    };

    eliminar_permisos_en_rol = async (
        permisos_a_eliminar: string[],
        rol: Rol,
        user_id?: string
    ): Promise<{
        mensaje_res: string;
        advertencias: string[] | undefined;
    }> => {
        let eliminados = 0;
        let conservados = 0;
        let advertencia_pedazos = [];
        let permisos_existentes = rol.permisos;
        let nombres_existentes: String[] = [];
        if (permisos_existentes) {
            let permisos_para_conservar = permisos_existentes;
            nombres_existentes = permisos_existentes.map(
                (un_perm: any) => un_perm
            );
            conservados = nombres_existentes.length;
            for (
                let i_perm = 0;
                i_perm < permisos_a_eliminar.length;
                i_perm++
            ) {
                const un_permiso_a_eliminar = permisos_a_eliminar[i_perm];
                if (nombres_existentes.includes(un_permiso_a_eliminar)) {
                    conservados -= 1;
                    eliminados += 1;
                    permisos_para_conservar.filter(
                        (permiso: any) => permiso !== un_permiso_a_eliminar
                    );
                } else {
                    let advertencia = this.mensaje_permiso_no_existe(
                        un_permiso_a_eliminar
                    );
                    syslog.warning(advertencia);
                    advertencia_pedazos.push(advertencia);
                }
            }
            if (eliminados > 0) {
                let permisos_totales = Object.values(permisos_para_conservar);
                this.getmodel().findOneAndUpdate(
                    { _id: rol._id },
                    {
                        permisos: permisos_totales
                    },
                    {
                        metadata: {
                            user_id,
                            description: 'permisos eliminados del rol',
                            large_description: `Se eliminaron los permisos:\n${permisos_a_eliminar.join('\n')}`
                        }
                    }
                );
            }
        }
        let advertencias!: string[];
        if (advertencia_pedazos) {
            if (advertencia_pedazos.length > 0) {
                advertencias = advertencia_pedazos;
            }
        }
        return {
            mensaje_res: `${eliminados} Permisos eliminados. ${conservados} Se conservaron.`,
            advertencias
        };
    };

    crear_rol_super_admin = async (): Promise<
        DocumentType<Rol, BeAnObject>
    > => {
        let rol_super_admin = this.getmodel().find({ super_admin: true });
        let ya_existe = rol_super_admin.length > 0;
        if (ya_existe) throw `Ya existe el rol ${NOMBRE_ROL_SUPER_ADMIN}`;

        let rol_input: Rol = {
            nombre: NOMBRE_ROL_SUPER_ADMIN,
            super_admin: true,
            description: 'Este rol tiene accDNeso a todas las rutas'.concat(
                ' con sus capacidades y sub-capacidades.'
            )
        };
        const NUEVO_ROL = new (this.getmodel())(rol_input);
        NUEVO_ROL.metadata = {
            description: 'rol de super administrador creado',
            large_description:
                'este rol solo se puede crear con una ruta que no valida usuario, por lo que no se registra que usuario lo crea'
        };
        return await NUEVO_ROL.save();
    };

    async obtener_permisos_disponibles() {
        return PERMISOS_DISPONIBLES;
    }
}
