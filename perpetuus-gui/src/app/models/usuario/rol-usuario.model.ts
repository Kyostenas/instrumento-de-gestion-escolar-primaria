import { PERMISOS_PERPETUUS } from 'src/app/config/permisos-gui.config';

export class RolUsuarioRecibir {
    public _id!: string;
    public sequence?: number;
    public description?: string;
    public is_active?: boolean;
    public super_admin?: boolean;
    public nombre?: string;
    public permisos?: PERMISOS_PERPETUUS[];

    constructor(data: ROL_DATA_TO_GET) {
        this._id = data._id;
        this.sequence = data.sequence;
        this.description = data.description;
        this.is_active = data.is_active;
        this.super_admin = data.super_admin;
        this.nombre = data.nombre;
        this.permisos = data.permisos;
    }
}

interface ROL_DATA_TO_GET {
    _id: string;
    sequence?: number;
    description?: string;
    is_active?: boolean;
    super_admin?: boolean;
    nombre?: string;
    permisos?: PERMISOS_PERPETUUS[];
}
