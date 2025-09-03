import { Request } from 'express';
import { Document, QueryOptions } from 'mongoose';

declare global {
    /**
     * Este es un tipo dinamico que permite extrar todos los valores
     * (incluso anidados) de un objeto y convertirlos en un solo
     * tipo. El objeto que se use se debe definir asi:
     * ```
     * const OBJETO = {
     *      a: 'valor1',
     *      b: 'valor2',
     *      c: {
     *          d: 'valor3'
     *      },
     * } as const;
     * ```
     *
     * Y si se quiere obtener un tipo de todos sus valores, se hace
     * esto:
     * ```
     * export type TIPOS_OBJETO =
     *      ValoreAnidadosRecursivosDeObjeto<typeof OBJETO, string>
     * ```
     *
     * Que es equivalente a hacer:
     * ```
     * export type TIPOS_OBJETO = 'valor1' | 'valor2' | 'valor3'
     * ```
     *
     * La diferencia es que esto funciona dinamicamente y el tipado
     * es seguro, por lo que si permite el autocompletado.
     */
    export type DeepKeys<T, tipo_valor> = T extends object
        ? T[keyof T] extends infer V
            ? V extends tipo_valor
                ? V
                : DeepKeys<V, tipo_valor>
            : never
        : never;

    export type Pagination = {
        limit: number;
        from: number;
        current_page: number;
        page_count: number;
        element_count: number;
        sorting_fields: {
            [type: string]: {
                field: string;
                title: string;
                order: 1 | -1;
            };
        };
    };

    export type GenericDocument = {
        _id?: string | Schema.Types.ObjectId | undefined;
        sequence?: number;
        description?: string;
        text_search_value?: string;
        is_active?: boolean;
    };

    export type DocumentMetadata = {
        user_id?: string | Types.ObjectId;
        description: string;
        large_description?: string;
    };

    export type PathsToPopulate = {
        path: string;
        model?: string;
        select?: string;
        populate?: PathsToPopulate;
    };
}

declare module 'express' {
    export interface Request {
        usuario?: {
            _id: string;
            nombre: string;
            nombre_usuario: string;
            correo: string;
            rol: string;

            /**
             * Esto solo se usa dentro del API. SIEMPRE debe llegar vacio
             * desde la GUI, porque en la primera se comprueba que el rol sea
             * el que el usuario tiene asignado. Si es correcta la
             * comprobacion, este arreglo se llena con los permisos del
             * rol correspondiente para ser comprobados con el guard.
             */
            permisos?: string[];
        };
        /**
         * Solo para usarse dentro del API. SIMPRE debe llegar vacio
         * desde la GUI. Es para mostrar un error cuando se deniega el
         * acceso porque no se tiene un permiso, cuyo valor se indica
         * aqui.
         */
        permiso_denegado?: string;
    }
}

declare module 'mongoose' {
    export interface Document {
        metadata?: {
            user_id?: string | Types.ObjectId;
            description: string;
            large_description?: string;
        };
        original_document?: Document;
    }
    export interface QueryOptions {
        metadata?: {
            user_id?: string | Types.ObjectId;
            description: string;
            large_description?: string;
        };
    }

    export interface Query {
        /**
         * A custom field to store the state of a document prior
         * to its modification.
         *
         * To be used with a pre hook to pass information to a post
         * hook.
         */
        _original_document?: any;
    }
}
