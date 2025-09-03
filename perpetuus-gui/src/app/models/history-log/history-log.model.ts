import { UsuarioRecibir } from '../usuario/usuario.model';

// (o==================================================================o)
//   #region HISTORY LOG
// (o-----------------------------------------------------------\/-----o)

export class HistoryLog {
    public _id!: string;
    public sequence?: number;
    public description?: string;
    public is_active?: boolean;
    public user?: UsuarioRecibir;
    public collection_name?: string;
    public modified_document_id?: string;
    public operation_type?: string;
    public movements?: Movement[];
    public delta?: any;
    public large_description?: string;

    constructor(data: HISTORY_LOG_TO_GET) {
        this._id = data._id;
        this.sequence = data.sequence;
        this.description = data.description;
        this.is_active = data.is_active;
        this.user = data.user;
        this.collection_name = data.collection_name;
        this.modified_document_id = data.modified_document_id;
        this.operation_type = data.operation_type;
        this.movements = data.movements?.map(
            (movement) => new Movement(movement)
        );
        this.delta = data.delta;
        this.large_description = data.large_description;
    }
}

interface HISTORY_LOG_TO_GET {
    _id: string;
    sequence?: number;
    description?: string;
    is_active?: boolean;
    user?: UsuarioRecibir;
    collection_name?: string;
    modified_document_id?: string;
    operation_type?: string;
    movements?: Movement[];
    delta?: any;
    large_description?: string;
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion HISTORY LOG
// (o==================================================================o)

// (o==================================================================o)
//   #region MOVEMENT
// (o-----------------------------------------------------------\/-----o)

export class Movement {
    public _id!: string;
    public path?: string;
    public from?: string;
    public value?: any;
    public previous_value?: any;
    public op?: 'replace' | 'remove' | 'add' | 'move';

    constructor(data: MOVEMENT_TO_GET) {
        this._id = data._id;
        this.path = data.path;
        this.from = data.from;
        this.value = data.value;
        this.previous_value = data.previous_value;
        this.op = data.op;
    }
}

interface MOVEMENT_TO_GET {
    _id: string;
    path?: string;
    from?: string;
    value?: any;
    previous_value?: any;
    op?: 'replace' | 'remove' | 'add' | 'move';
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion MOVEMENT
// (o==================================================================o)

// (o==================================================================o)
//   #region FILTERS
// (o-----------------------------------------------------------\/-----o)

export interface HistoryLogFilters {
    document_id: string;
}

// (o-----------------------------------------------------------/\-----o)
//   #endregion FILTERS
// (o==================================================================o)
