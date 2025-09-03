import { DocumentType } from '@typegoose/typegoose';
import { Schema } from 'mongoose';
import mongoose, { CallbackError } from 'mongoose';
import { HISTORY_LOG_MODEL } from '../../componentes/history-log/history-log.model';
import { ACCIONES_MONGOOSE } from '../../utils/constantes.utils';
import { syslog as _syslog } from '../../utils/logs.utils';
const syslog = _syslog(module);
import jsonpatch from 'jsondiffpatch/formatters/jsonpatch';
import * as jsondiffpatch from 'jsondiffpatch';
import {
    ReplaceOp,
    Op,
    MoveOp,
    AddOp,
    RemoveOp
} from 'jsondiffpatch/formatters/jsonpatch';
import { seleccionarCampoCualquierNivelProfundo } from '../../utils/general.utils';
const JSONDIFFPATCH_INSTANCE = jsondiffpatch.create({
    arrays: {
        detectMove: true,
        includeValueOnMove: true
    }
});

// (o==================================================================o)
//   #region PLUGIN (INICIO)
// (o-----------------------------------------------------------\/-----o)

function hystory_log_plugin<T>(schema: Schema<T>) {
    /* Store the state of the document before it's modified */
    schema.pre(
        ACCIONES_MONGOOSE.SAVE,
        async function (
            this: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            this._original_document = this;
            try {
                next();
            } catch {}
        }
    );
    /* Trigger history log */
    schema.post(
        ACCIONES_MONGOOSE.SAVE,
        async function (
            doc: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            const metadata = doc.metadata ?? { description: '' };
            generate_history_log(
                doc,
                undefined,
                schema,
                ACCIONES_MONGOOSE.SAVE,
                metadata,
                next
            );
            try {
                next();
            } catch {}
        }
    );
    /* Store the state of the document before it's modified */
    schema.pre(
        ACCIONES_MONGOOSE.FIND_ONE_AND_UPDATE,
        async function (
            this: mongoose.Query<any, any>,
            next: (err?: CallbackError) => void
        ) {
            const ORIGINAL_DOC = await this.model
                .findOne(this.getFilter())
                .lean();
            this._original_document = ORIGINAL_DOC;
            try {
                next();
            } catch {}
        }
    );

    /* Trigger history log */
    schema.post(
        ACCIONES_MONGOOSE.FIND_ONE_AND_UPDATE,
        async function (
            this: mongoose.Query<any, any>,
            next: (err?: CallbackError) => void
        ) {
            const metadata = this.getOptions().metadata ?? { description: '' };
            const query = this.getQuery();
            const doc = await this.model.findOne(query);
            generate_history_log(
                doc,
                this,
                schema,
                ACCIONES_MONGOOSE.FIND_ONE_AND_UPDATE,
                metadata,
                next
            );
            try {
                next();
            } catch {}
        }
    );
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion PLUGIN (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region FUNCIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

async function generate_history_log<T>(
    document: DocumentType<T>,
    query: mongoose.Query<any, any> | undefined,
    schema: Schema<T>,
    operation_type: DeepValues<typeof ACCIONES_MONGOOSE, string>,
    metadata: DocumentMetadata,
    next: any
) {
    try {
        const doc = document;
        const collection_name = document.collection.name;
        let previous_doc = null;
        if (!!query) {
            previous_doc = query._original_document;
        } else {
            previous_doc = JSON.parse(
                JSON.stringify(
                    operation_type === 'save' ? {} : doc._original_document
                )
            );
        }
        const new_doc = JSON.parse(JSON.stringify(doc));
        const DELTA = JSONDIFFPATCH_INSTANCE.diff(previous_doc, new_doc);
        const JSON_PATCH = new jsonpatch().format(DELTA);
        const MOVEMENTS = JSON_PATCH.map((one_movement) => {
            one_movement.previous_value =
                seleccionarCampoCualquierNivelProfundo(
                    previous_doc,
                    one_movement.path,
                    '/',
                    {
                        noRecorrerArreglos: true,
                        reemplazoValorIndefinido: '',
                        valorError: ''
                    }
                );
            return one_movement;
        });
        const registroHistorial = new HISTORY_LOG_MODEL({
            collection_name: collection_name,
            modified_document_id: doc._id,
            delta: DELTA,
            movements: MOVEMENTS,
            operation_type,
            description: metadata.description,
            large_description: metadata.large_description,
            user: new Schema.Types.ObjectId(metadata.user_id)
        });
        await registroHistorial.save();
        try {
            next();
        } catch {}
    } catch (err: any) {
        try {
            next(
                new Error(
                    `No se pudo crear un registro de historial: ${err.message}`
                )
            );
        } catch (_err) {
            syslog.error(`Primero hubo un error: ${err}\nLuego otro: ${err}`);
        }
    }
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion FUNCIONES (FIN)
// (o==================================================================o)

export default hystory_log_plugin;
