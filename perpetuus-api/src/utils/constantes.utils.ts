// (o==================================================================o)
//   MONGOOSE (INICIO)
//   describir acciones de mongoose en la bd
// (o-----------------------------------------------------------\/-----o)

export const ACCIONES_MONGOOSE = {
    AGGREGATE: <'aggregate'>'aggregate',
    COUNT: <'count'>'count',
    COUNT_DOCUMENTS: <'countDocuments'>'countDocuments',
    DELETE_ONE: <'deleteOne'>'deleteOne',
    DELETE_MANY: <'deleteMany'>'deleteMany',
    ESTIMATED_DOCUMENT_COUNT: <'estimatedDocumentCount'>(
        'estimatedDocumentCount'
    ),
    FIND: <'find'>'find',
    FIND_BY_ID: <'findById'>'findById',
    FIND_ONE: <'findOne'>'findOne',
    FIND_ONE_AND_DELETE: <'findOneAndDelete'>'findOneAndDelete',
    FIND_ONE_AND_REMOVE: <'findOneAndRemove'>'findOneAndRemove',
    FIND_ONE_AND_REPLACE: <'findOneAndReplace'>'findOneAndReplace',
    FIND_ONE_AND_UPDATE: <'findOneAndUpdate'>'findOneAndUpdate',
    INIT: <'init'>'init',
    INSERT_MANY: <'insertMany'>'insertMany',
    REMOVE: <'remove'>'remove',
    REPLACE_ONE: <'replaceOne'>'replaceOne',
    SAVE: <'save'>'save',
    UPDATE: <'update'>'update',
    UPDATE_ONE: <'updateOne'>'updateOne',
    UPDATE_MANY: <'updateMany'>'updateMany',
    VALIDATE: <'validate'>'validate'
};
export const TRADUCCIONES_ACCIONES_MONGOOSE = {
    aggregate: 'consultar de manera agrupada',
    count: 'contar',
    countDocuments: 'contar elementos',
    deleteOne: 'eliminar uno',
    deleteMany: 'eliminar varios',
    estimatedDocumentCount: 'contar de manera estimada elementos',
    find: 'encontrar',
    findById: 'encontrar por id',
    findOne: 'encontrar uno',
    findOneAndDelete: 'encontrar uno y eliminar',
    findOneAndRemove: 'encontar uno y remover',
    findOneAndReplace: 'encontrar uno y reemplazar',
    findOneAndUpdate: 'encontrar uno y actualizar',
    init: 'inicializar',
    insertMany: 'insertar varios',
    remove: 'remover',
    replaceOne: 'reemplazar uno',
    save: 'crear',
    update: 'actualizar',
    updateOne: 'actualizar uno',
    updateMany: 'actualizar varios',
    validate: 'validar'
};

// (o-----------------------------------------------------------/\-----o)
//   MONGOOSE (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   FECHA Y TIEMPO (INICIO)
// (o-----------------------------------------------------------\/-----o)

export const NOMBRES_MESES = {
    1: { largo: 'enero', corto: 'ene' },
    2: { largo: 'febrero', corto: 'feb' },
    3: { largo: 'marzo', corto: 'mar' },
    4: { largo: 'abril', corto: 'abr' },
    5: { largo: 'mayo', corto: 'may' },
    6: { largo: 'junio', corto: 'jun' },
    7: { largo: 'julio', corto: 'jul' },
    8: { largo: 'agosto', corto: 'ago' },
    9: { largo: 'septiembre', corto: 'sep' },
    10: { largo: 'octubre', corto: 'oct' },
    11: { largo: 'noviembre', corto: 'nov' },
    12: { largo: 'diciembre', corto: 'dic' }
};
export const NOMBRES_DIAS = {
    1: { largo: 'domingo', corto: 'dom' },
    2: { largo: 'lunes', corto: 'lun' },
    3: { largo: 'martes', corto: 'mar' },
    4: { largo: 'miércoles', corto: 'mié' },
    5: { largo: 'jueves', corto: 'jue' },
    6: { largo: 'viernes', corto: 'vie' },
    7: { largo: 'sábado', corto: 'sáb' }
};
export const ZONA_HORARIO_MEXICO = 'America/Mexico_City';
export const ZONA_HORARIA_MEXICO_UTC = 'GMT-06:00';
export const LOCALES_MEXICO = 'en-MX';

export const MILISEGUNDOS_SEGUNDO = 1000;
export const MILISEGUNDOS_MINUTO = MILISEGUNDOS_SEGUNDO * 60;
export const MILISEGUNDOS_HORA = MILISEGUNDOS_MINUTO * 60;
export const MILISEGUNDOS_DIA = MILISEGUNDOS_HORA * 24;
export const MILISEGUNDOS_SEMANA = MILISEGUNDOS_DIA * 7;
export const MILISEGUNDOS_MES30 = MILISEGUNDOS_DIA * 30;
export const MILISEGUNDOS_MES31 = MILISEGUNDOS_DIA * 31;
export const MILISEGUNDOS_MES28 = MILISEGUNDOS_DIA * 28;
export const MILISEGUNDOS_MES29 = MILISEGUNDOS_DIA * 29;
export const MILISEGUNDOS_ANIO = MILISEGUNDOS_DIA * 365;
export const MILISEGUNDOS_ANIOBIS = MILISEGUNDOS_DIA * 366;

export const SEGUNDOS_MINUTO = 60;
export const SEGUNDOS_HORA = SEGUNDOS_MINUTO * 60;
export const SEGUNDOS_DIA = SEGUNDOS_HORA * 24;
export const SEGUNDOS_SEMANA = SEGUNDOS_DIA * 7;
export const SEGUNDOS_MES30 = SEGUNDOS_DIA * 30;
export const SEGUNDOS_MES31 = SEGUNDOS_DIA * 31;
export const SEGUNDOS_MES28 = SEGUNDOS_DIA * 28;
export const SEGUNDOS_MES29 = SEGUNDOS_DIA * 29;
export const SEGUNDOS_ANIO = SEGUNDOS_DIA * 365;
export const SEGUNDOS_ANIOBIS = SEGUNDOS_DIA * 366;

// (o-----------------------------------------------------------/\-----o)
//   FECHA Y TIEMPO (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   CREACION SUPER ADMIN (INICIO)
//   cuidado con esto, la contrasena se debe cambiar
// (o-----------------------------------------------------------\/-----o)

export const NOMBRE_ROL_SUPER_ADMIN = 'SUPER ADMINISTRADOR';
export const NOMBRE_USUARIO_SUPER_ADMIN = 'Super Usuario';
export const CONTRASENA_SUPER_ADMIN_TEMPORAL = 'superadmin';
export const CORREO_SUPER_ADMIN_TEMPORAL = 'admin@perpetuus.mx';

// (o-----------------------------------------------------------/\-----o)
//   CREACION SUPER ADMIN (FIN)
// (o==================================================================o)

// (o==================================================================o)
//   VALIDACIONES (INICIO)
// (o-----------------------------------------------------------\/-----o)

export const REGEX_VALIDACION_CORREO =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

// (o-----------------------------------------------------------/\-----o)
//   VALIDACIONES (FIN)
// (o==================================================================o)
