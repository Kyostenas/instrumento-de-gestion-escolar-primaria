import { CallbackError, Schema } from 'mongoose';
import { ACCIONES_MONGOOSE } from '../../utils/constantes.utils';
import { COUNTER_MODEL } from './auto-increment.model';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

export function auto_increment<T>(
    schema: Schema,
    options: AutoIncrementOptions
) {
    schema.pre(
        ACCIONES_MONGOOSE.SAVE,
        async function (
            this: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            const MODEL = this.constructor as ModelType<T>;
            const COLLECTION_NAME =
                MODEL.collection.name ?? schema.get('collection');
            const COUNTER_ID = `${COLLECTION_NAME}_counter`;
            let EXISTENTE = await COUNTER_MODEL.findOne({
                counter_id: COUNTER_ID
            }).lean();
            if (!!EXISTENTE) {
                this.set(options.field, EXISTENTE.current + 1);
            } else {
                await new COUNTER_MODEL({
                    counter_id: COUNTER_ID,
                    current: 0
                }).save();
                EXISTENTE = await COUNTER_MODEL.findOne({
                    counter_id: COUNTER_ID
                }).lean();
                this.set(options.field, 1);
            }
            if (!this.metadata) {
                this.metadata = {};
            }
            this.metadata.extra = {
                counter_id: COUNTER_ID,
                current: EXISTENTE?.current
            };
            try {
                next();
            } catch {}
        }
    );
    schema.post(
        ACCIONES_MONGOOSE.SAVE,
        async (doc: DocumentType<T>, next: (err?: CallbackError) => void) => {
            await COUNTER_MODEL.findOneAndUpdate(
                {
                    counter_id: doc.metadata?.extra?.counter_id
                },
                {
                    current: doc.metadata?.extra?.current + 1
                }
            );
            try {
                next();
            } catch {}
        }
    );
}

export interface AutoIncrementOptions {
    field: string;
}
