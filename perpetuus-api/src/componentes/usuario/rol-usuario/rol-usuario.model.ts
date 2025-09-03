// (o==================================================================o)
//   #region IMPORTACIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

/* IMPORTACIONES EXTERNAS */
import { Schema } from 'mongoose';
import {
    getModelForClass,
    modelOptions,
    plugin,
    prop
} from '@typegoose/typegoose';

/* UTILIDADES */
import { arreglo_valores_profundos } from '../../../utils/general.utils';
import {
    PERMISOS_DISPONIBLES,
    PERMISOS_PERPETUUS
} from '../../../config/roles/permisos-api.config';
import { auto_increment } from '../../../plugins/auto-increment/auto-increment.plugin';
import hystory_log_plugin from '../../../plugins/history/history-log.plugin';
import text_search_index from '../../../plugins/text-search-index/text-search-index.plugin';

// (o-----------------------------------------------------------/\-----o)
//   #endregion IMPORTACIONES (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region ESQUEMA (INICIO)
// (o-----------------------------------------------------------\/-----o)

const TEXT_SEARCH_FIELDS = ['sequence', 'description', 'nombre'];

@plugin(auto_increment<typeof ROL_MODEL>, { field: 'sequence' })
@plugin(hystory_log_plugin<typeof ROL_MODEL>, {})
@plugin(text_search_index<typeof ROL_MODEL>, { fields: TEXT_SEARCH_FIELDS })
@modelOptions({
    schemaOptions: {
        collection: 'roles',
        timestamps: true
    }
})
class Rol implements GenericDocument {
    _id?: string | Schema.Types.ObjectId | undefined;

    @prop({ unique: true })
    public sequence?: number;

    @prop()
    public description?: string;

    @prop()
    public text_search_value?: string;

    @prop({ default: true })
    public is_active?: boolean;

    @prop({ default: false })
    super_admin?: boolean;

    @prop({
        required: [true, 'Nombre de rol requerido'],
        unique: true
    })
    nombre!: string;

    @prop({
        enum: {
            values: arreglo_valores_profundos(PERMISOS_DISPONIBLES),
            message: 'El permiso: "{value}" no existe'
        },
        type: () => [String],
        default: []
    })
    permisos?: PERMISOS_PERPETUUS[];
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion ESQUEMA (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   #region EXPORTACIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

const ROL_MODEL = getModelForClass(Rol);
export { ROL_MODEL, Rol };

// (o-----------------------------------------------------------/\-----o)
//   #endregion EXPORTACIONES (FIN)
// (o==================================================================o)
