// (o==================================================================o)
//   #region IMPORTACIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

/* IMPORTACIONES EXTERNAS */
import { Schema } from 'mongoose';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

// (o-----------------------------------------------------------/\-----o)
//   #endregion IMPORTACIONES (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region ESQUEMA (INICIO)
// (o-----------------------------------------------------------\/-----o)
@modelOptions({
    schemaOptions: {
        collection: '__counters',
        timestamps: true
    }
})
class Counter {
    _id?: string | Schema.Types.ObjectId | undefined;

    @prop({ required: true })
    counter_id!: string;

    @prop({ required: true })
    current!: number;
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion ESQUEMA (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region EXPORTACIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

const COUNTER_MODEL = getModelForClass(Counter);
COUNTER_MODEL.createCollection();
export { COUNTER_MODEL, Counter };

// (o-----------------------------------------------------------/\-----o)
//   #endregion EXPORTACIONES (FIN)
// (o==================================================================o)
