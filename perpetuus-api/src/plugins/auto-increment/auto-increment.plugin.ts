import mongoose, { CallbackError, Document, Schema } from 'mongoose';
import { ACCIONES_MONGOOSE } from '../../utils/constantes.utils';
import { COUNTER_MODEL } from './auto-increment.model';
import { DocumentType } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

export function auto_increment<T>(
    schema: Schema,
    options: AutoIncrementOptions
) {
    schema.post(
        ACCIONES_MONGOOSE.SAVE,
        async function (
            doc: DocumentType<T>,
            next: (err?: CallbackError) => void
        ) {
            const MODEL = doc.constructor as ModelType<T>;
            const COLLECTION_NAME =
                MODEL.collection.name ?? schema.get('collection');
            const COUNTER_ID = `${COLLECTION_NAME}_counter`;
            const EXISTENTE = await COUNTER_MODEL.findOne({
                counter_id: COUNTER_ID
            }).lean();
            if (!!EXISTENTE) {
                await COUNTER_MODEL.findOneAndUpdate(
                    {
                        counter_id: COUNTER_ID
                    },
                    {
                        current: EXISTENTE.current + 1
                    }
                );
                const UPDATE: any = { [options.field]: EXISTENTE.current + 1 };
                await MODEL.updateOne({ _id: doc._id }, UPDATE);
            } else {
                await new COUNTER_MODEL({
                    counter_id: COUNTER_ID,
                    current: 1
                }).save();
                const UPDATE: any = { [options.field]: 1 };
                await MODEL.updateOne({ _id: doc._id }, UPDATE);
            }
            try {
                next();
            } catch {}
        }
    );
}

export interface AutoIncrementOptions {
    field: string;
}
