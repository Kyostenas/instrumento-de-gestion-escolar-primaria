import { TemplateRef } from '@angular/core';
import { ValidatorFn } from '@angular/forms';

export type TipoCampoBase =
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
    // ESPECIALES =============================
    | 'TEXTAREA'
    | 'DATALIST'
    // requieren bootstrap --------------------
    | 'BS_DROPDOWN'
    | 'BS_LISTGROUP';

export type ElementoDropDown = {
    contenido_texto?: string;
    contenido_plantilla?: TemplateRef<any>;
};

export type ElementosListGroup = {
    contenido_texto?: string;
    contenido_plantilla?: TemplateRef<any>;
};

/**
 * Pensado para bootstrap 5
 */
const clases_especiales: { [type: string]: any } = {
    radio: 'form-check-input',
    checkbox: 'form-check-input',
    range: 'form-range'
};

function encontrar_clase_bootstrap(tipo: string) {
    if (clases_especiales[tipo]) return clases_especiales[tipo];
    else return 'form-control';
}

export class CampoBaseFormularioDinamico<T> {
    constructor(
        opciones: {
            /**
             * El valor contenido en el campo.
             */
            valor?: T;
            /**
             * El nombre del campo en el objeto resultante.
             */
            llave?: string;
            /**
             * El título a mostrar en el input.
             */
            etiqueta?: string;
            /**
             * El tipo de input a usar.
             */
            tipo?: TipoCampoBase;
            /**
             * Solo si el tipo es `BS_DROPDOWN`. Es para
             * indicar que elementos contendrá el dropdown
             * y sus opciones.
             */
            elementos_dropdown?: ElementoDropDown[];
            /**
             * Solo si el tipo es `BS_LISTGROUP`. Es para
             * indicar que elementos contendrá el list-group
             * y sus opciones.
             */
            elementos_list_group?: ElementosListGroup[];
            /**
             * Solo si el tipo es `DATALIST`. Es para
             * indicar que elementos contendrá el datalist.
             */
            elementos_data_list?: string[];
            /**
             * Arreglo de validaciones de Angular.
             */
            validaciones_campo?: ValidatorFn[];
            /**
             * Para especificar que clase ponerle al
             * div que contiene el campo (form control).
             * Puede llevar lo que sea, pero se recomienda
             * solo usar clases de grid de Bootstrap (dentro
             * de row).
             */
            clase_columna?: string;
            clase_input?: string;
        } = {}
    ) {
        this.valor = opciones.valor;
        this.llave = opciones.llave ?? '';
        this.etiqueta = opciones.etiqueta ?? '';
        this.tipo = opciones.tipo ?? 'text';
        this.elementos_dropdown = opciones.elementos_dropdown ?? [];
        this.elementos_list_group = opciones.elementos_list_group ?? [];
        this.elementos_data_list = opciones.elementos_data_list ?? [];
        this.validaciones_campo = opciones.validaciones_campo ?? [];
        this.clase_bootstrap = encontrar_clase_bootstrap(this.tipo);
        this.clase_columna = opciones.clase_columna ?? 'col-12';
        this.clase_input = opciones.clase_input ?? '';
    }

    valor?: T;
    llave!: string;
    etiqueta!: string;
    tipo!: TipoCampoBase;
    elementos_dropdown!: ElementoDropDown[];
    elementos_list_group!: ElementosListGroup[];
    elementos_data_list!: string[];
    validaciones_campo!: ValidatorFn[];
    clase_bootstrap!: string;
    clase_columna!: string;
    clase_input!: string;
}

export class CampoFormulario extends CampoBaseFormularioDinamico<string> {}
