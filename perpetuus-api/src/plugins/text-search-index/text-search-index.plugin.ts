import mongoose, { CallbackError, Schema } from 'mongoose';
import { ACCIONES_MONGOOSE } from '../../utils/constantes.utils';
import { Model } from 'mongoose';
import { seleccionarCampoCualquierNivelProfundo } from '../../utils/general.utils';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

function text_search_index<T>(schema: Schema, options: TextSearchIndexOptions) {
    schema.post(
        ACCIONES_MONGOOSE.SAVE,
        async function (
            doc: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            const MODEL = doc.constructor as ModelType<T>;
            const POPULATED = await MODEL.findOne({ _id: doc._id })
                .populate(options.paths_to_populate ?? [])
                .lean();
            await create_text_search_field(POPULATED, options.fields, MODEL);
            try {
                next();
            } catch {}
        }
    );
    schema.post(
        ACCIONES_MONGOOSE.FIND_ONE_AND_UPDATE,
        async function (
            this: mongoose.Query<any, T>,
            result: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            const query = this.getQuery();
            const doc = await this.model
                .findOne(query)
                .populate(options.paths_to_populate ?? [])
                .lean();
            await create_text_search_field(doc, options.fields, this.model);
            try {
                next();
            } catch {}
        }
    );
    schema.index({ text_search_value: 'text' }, { name: 'text_search_value' });
}

/**
 * Agrega el campo 'text_search_value' utilizando los campos indicados en `campos`
 *
 * ## ATENCION
 * Debe agregarse este campo (text_search_value) en el esquema para el que se
 * use esta funcion.
 *
 * Esta funcion esta pensada para usarse en un post hook.
 *
 * @param documento El documento de mongo al cual agregarle el campo 'text_search_value'.
 * @param campos Nombres de los campos a usar.
 * @param modelo El modelo al que el documento en cuestion corresponde.
 * @param next La funcion next que proviene desde el post hook.
 * @param opciones Opciones extra para procesar el resultado o alterar el comportamiento de la funcion
 */
export async function create_text_search_field(
    documento: any,
    campos: string[],
    modelo: Model<any>,
    opciones: {
        usarComoFuncion?: boolean;
    } = {}
) {
    if (opciones?.usarComoFuncion === undefined) {
        opciones.usarComoFuncion = false;
    }
    try {
        /* Si el documento no tiene _id, probablemente
       no existe. De cualquier forma, no hacer nada si
       no tiene ese campo */
        if (!!documento?._id) {
            let documentoPopulado = documento;
            // if (!!opciones.usarComoFuncion) {
            //     try {
            //         documentoPopulado = documento.toObject();
            //     } catch {
            //         documentoPopulado = documento;
            //     }
            // } else {
            //     try {
            //         documentoPopulado = (
            //             await modelo.findById(documento._id)
            //         ).toObject();
            //     } catch {
            //         documentoPopulado = await modelo.findById(documento._id).lean();
            //     }
            // }
            let busqueda = campos
                .map((un_campo) => {
                    let valor_campo = seleccionarCampoCualquierNivelProfundo(
                        documentoPopulado,
                        un_campo,
                        '.'
                    );
                    if (
                        Object.prototype.toString.call(valor_campo) ==
                        '[object Array]'
                    ) {
                        valor_campo = [...new Set(valor_campo)];
                        valor_campo = valor_campo.join(' ');
                    }
                    if (!!valor_campo) {
                        try {
                            return valor_campo.toString();
                        } catch {
                            return String(valor_campo);
                        }
                    }
                })
                .filter((x) => x !== undefined)
                .join(' ');
            if (!!opciones.usarComoFuncion) {
                return busqueda;
            } else {
                await modelo.updateOne(
                    { _id: documento._id },
                    { text_search_value: busqueda }
                );
            }
        }
    } catch (err: any) {
        console.log('ERROR: No se pudo crear un campo de busqueda');
        console.log(new Error(err));
        if (!!opciones.usarComoFuncion) {
            throw err;
        }
    }
}

export interface TextSearchIndexOptions {
    fields: string[];
    paths_to_populate?: PathsToPopulate[];
}

export default text_search_index;
