import { hashSync as bcrypt_hashsync } from 'bcryptjs';
import {
    CONTRASENA_SUPER_ADMIN_TEMPORAL,
    CORREO_SUPER_ADMIN_TEMPORAL,
    NOMBRE_ROL_SUPER_ADMIN,
    NOMBRE_USUARIO_SUPER_ADMIN
} from '../../../utils/constantes.utils';
import { USER_MODEL, User } from '../usuario/usuario.model';
import { ROL_MODEL } from '../rol-usuario/rol-usuario.model';
import { generar_criterios_sort } from '../../../utils/busqueda-paginacion.utiles';
import { Types } from 'mongoose';
import { CRUD_Service } from '../../../abstract-classes/crud/crud-service.abstract';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject, ReturnModelType } from '@typegoose/typegoose/lib/types';
import DBReadingService from '../../../services/db-reading/db-reading.service';

export class UserService extends CRUD_Service<typeof USER_MODEL, User> {
    public getmodel(): ReturnModelType<typeof User, BeAnObject> {
        return USER_MODEL;
    }

    // (o==================================================================o)
    //   #region CRUD
    // (o-----------------------------------------------------------\/-----o)

    create = async ({
        nombres,
        apellidos,
        nombre_usuario,
        contrasena,
        correo,
        numero_celular,
        user_id
    }: {
        nombres: string;
        apellidos: string;
        nombre_usuario: string;
        contrasena: string;
        correo: string;
        numero_celular?: string;
        user_id?: string;
    }): Promise<DocumentType<User, BeAnObject>> => {
        if (nombre_usuario === NOMBRE_USUARIO_SUPER_ADMIN) {
            throw 'Esta prohibido usar ese nombre de usuario';
        }
        const contrasena_encriptada = bcrypt_hashsync(contrasena, 12);
        const usuario_input: User = {
            nombres,
            apellidos,
            nombre_usuario,
            contrasena: contrasena_encriptada,
            correo,
            numero_celular
        };
        let nuevo_usuario = new (this.getmodel())(usuario_input);
        nuevo_usuario.metadata = {
            user_id,
            description: 'Usuario creado'
        };
        return await nuevo_usuario.save();
    };
    read = async ({
        pagination,
        term
    }: {
        pagination: Pagination;
        term: string;
    }): Promise<{
        result: DocumentType<User, BeAnObject>[] | User[];
        total: number;
        pagination: Pagination;
    }> => {
        const DB_READING_SERVICE = new DBReadingService({
            pagination,
            model: this.getmodel(),
            term,
            projection: {
                __v: 0,
                contrasena: 0,
                rfrsh_tkn_validity: 0,
                rfrsh_tkn: 0,
                text_search_value: 0
            },
            paths_to_populate: [
                {
                    path: 'rol',
                    select: '-text_search_value -__v -permisos'
                }
            ]
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
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        const USER = await this.getmodel().findOne({ sequence }).lean();
        if (!USER) throw new Error(`No se encontró el usuario #${sequence}`);
        return USER;
    };
    update = async ({
        id,
        nombres,
        apellidos,
        correo,
        numero_celular,
        user_id
    }: {
        id: string;
        nombres: string;
        apellidos: string;
        correo?: string;
        numero_celular?: string;
        user_id?: string;
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        const rol = this.getmodel().findOneAndUpdate(
            { _id: id },
            {
                nombres,
                apellidos,
                correo,
                numero_celular
            },
            {
                metadata: {
                    user_id,
                    description: 'usuario modificado'
                }
            }
        );
        return rol;
    };
    activate = async ({
        sequence,
        user_id
    }: {
        sequence: number;
        user_id: string;
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        this.getmodel().findOneAndUpdate(
            { sequence },
            { is_active: true },
            {
                metadata: {
                    user_id,
                    description: 'usuario activado'
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
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        this.getmodel().findOneAndUpdate(
            { sequence },
            { is_active: false },
            {
                metadata: {
                    user_id,
                    description: 'usuario desactivado'
                },
                lean: true
            }
        );
        return await this.read_by_sequence({ sequence });
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CRUD
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region EXTRA-ACTIONS
    // (o-----------------------------------------------------------\/-----o)

    assign_rol_to_user = async ({
        sequence,
        rol,
        user_id
    }: {
        sequence: number;
        rol: string;
        user_id?: string;
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        const ROL = await ROL_MODEL.findOne({ sequence }).lean();
        return await this.getmodel().findOneAndUpdate(
            { _id: sequence },
            { $set: { rol } },
            {
                metadata: {
                    user_id,
                    description: 'rol de usuario modificado',
                    large_description: `el nuevo rol del usuario es: ${ROL?.nombre}`
                },
                new: true
            }
        );
    };

    remove_rol_from_user = async ({
        sequence,
        user_id
    }: {
        sequence: number;
        user_id?: string;
    }): Promise<User | DocumentType<User, BeAnObject> | null> => {
        return await this.getmodel().findOneAndUpdate(
            { sequence },
            { $unset: { rol: true } },
            {
                metadata: {
                    user_id,
                    description: 'rol de usuario removido'
                },
                new: true
            }
        );
    };

    create_super_admin = async (): Promise<
        User | DocumentType<User, BeAnObject> | null
    > => {
        const rol_super_admin = await ROL_MODEL.findOne({
            super_admin: true
        }).lean();
        const no_existe_rol_super_admin = !rol_super_admin;
        if (no_existe_rol_super_admin) {
            throw `No existe el rol ${NOMBRE_ROL_SUPER_ADMIN}`;
        }
        const usuario_super_admin = await this.getmodel()
            .findOne({
                nombre_usuario: NOMBRE_USUARIO_SUPER_ADMIN
            })
            .lean();
        console.log(usuario_super_admin);
        let ya_existe_usuario_super_admin = !!usuario_super_admin;
        if (ya_existe_usuario_super_admin) {
            throw `Ya existe el usuario ${NOMBRE_USUARIO_SUPER_ADMIN}`;
        }

        const rol_a_usar = rol_super_admin;
        const nombre = NOMBRE_USUARIO_SUPER_ADMIN.split(' ')[0];
        const apellido = NOMBRE_USUARIO_SUPER_ADMIN.split(' ')[1];
        const contrasena_encriptada = bcrypt_hashsync(
            CONTRASENA_SUPER_ADMIN_TEMPORAL,
            12
        );
        const usuario_input: User = {
            nombres: nombre,
            apellidos: apellido,
            nombre_usuario: NOMBRE_USUARIO_SUPER_ADMIN,
            contrasena: contrasena_encriptada,
            correo: CORREO_SUPER_ADMIN_TEMPORAL,
            rol: new Types.ObjectId(rol_a_usar._id.toString())
        };
        const NEW_USER = new (this.getmodel())(usuario_input);
        NEW_USER.metadata = {
            description: 'Se creó el usuario super administrador',
            large_description:
                'Este usuario solo se puede crear externamente, por lo que no especifica qué usuario lo creó'
        };
        return await NEW_USER.save();
    };

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion EXTRA-ACTIONS
    // (o==================================================================o)
}
