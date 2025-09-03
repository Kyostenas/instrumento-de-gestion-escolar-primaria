import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-mensajes-error-validacion-formularios',
    imports: [],
    providers: [DecimalPipe],
    templateUrl: './mensajes-error-validacion-formularios.component.html',
    styleUrl: './mensajes-error-validacion-formularios.component.scss'
})
export class MensajesErrorValidacionFormulariosComponent {
    _campo!: AbstractControl;
    ultimo_mensaje!: string;

    mensaje: { [type: string]: any } = {};
    /**
     * El control con el que se haran las comprobaciones.
     *
     * @type {AbstractControl}
     * @memberof ValidacionInputsComponent
     */
    @Input() set campo(value: AbstractControl) {
        this._campo = value;

        if (value) {
            this.mensaje = {
                pattern: this.pattern.bind(this),
                required: () => {
                    return `Este campo es obligatorio`;
                },
                min: this.min.bind(this),
                max: this.max.bind(this),
                notInteger: () => {
                    return `Se necesita un número entero positivo`;
                },
                invalidNumber: () => {
                    return `No es un número
        válido`;
                },
                tamanoMinimo: this.tamanoMinimo.bind(this),
                minlength: this.minlength.bind(this),
                maxlength: this.maxlength.bind(this),
                general: this.general.bind(this),
                email: () => {
                    return 'Correo no valido';
                },

                'Mask error': () => 'Hay un error en el formato (mask)'
            };
        }
    }

    get campo(): AbstractControl {
        return this._campo;
    }
    /**
     * Un texto especial que se quiera mostrar. Este no se valida.
     *
     * @type {string}
     * @memberof ValidacionInputsComponent
     */
    @Input() especial!: string;

    /**
     * Define si se salta la validacion del touch para mostrar
     * siempre la validacion aunque el usuario no interactue con el
     * control.
     *
     * @type {boolean}
     * @memberof ValidacionInputsComponent
     */
    @Input() directo: boolean = false;

    /**
     * Un texto para mostrar cuando hay error de **pattern** en lugar
     * del que está por defecto. No se valida.
     *
     * @type {string}
     * @memberof ValidacionInputsComponent
     */
    @Input() mensajePattern: boolean = false;

    @Input() debug: boolean = false;

    constructor(private decimal_pipe: DecimalPipe) {}

    ngOnInit() {}

    min(): string {
        return `El valor mínimo permitido es ${this.decimal_pipe.transform(this.campoGetError('min').min)}`;
    }

    max(): string {
        return `El máximo permitido es ${this.decimal_pipe.transform(this.campoGetError('max').max)}`;
    }

    tamanoMinimo(): string {
        let cantidad =
            this.campoGetError('tamanoMinimo').minimo > 1 ? '' : 'un ';
        let campo =
            this.campoGetError('tamanoMinimo').minimo > 1 ? 'campos' : 'campo';
        return `Debes seleccionar por lo menos ${cantidad} ${campo}`;
    }

    minlength(): string {
        let campo = this.campoGetError('minlength');
        let cantidadCar = campo.requiredLength;
        let faltan = cantidadCar - campo.actualLength;
        let conjuncion = cantidadCar > 1 ? cantidadCar : 'un ';
        let caracteres = cantidadCar > 1 ? 'caracteres' : 'caracter';
        return `Debes escribir por lo menos ${conjuncion} ${caracteres}. (Faltan ${faltan})`;
    }
    maxlength(): string {
        let campo = this.campoGetError('maxlength');
        let cantidadCar = campo.requiredLength;
        let sobran = campo.actualLength - cantidadCar;
        let conjuncion = cantidadCar > 1 ? cantidadCar : 'un ';
        let caracteres = cantidadCar > 1 ? 'caracteres' : 'caracter';
        return `El máximo es  ${conjuncion} ${caracteres}. (Sobran ${sobran})`;
    }

    general() {
        return this.campoGetError('general').mensaje;
    }

    pattern() {
        if (this.mensajePattern) return this.mensajePattern;
        else return `Patrón no cumplido`;
    }

    campoGetError(a: string) {
        return this.campo.getError(a);
    }

    campoHasError(a: string) {
        if (!this.campo) return false;
        return this.campo.hasError(a);
    }

    listaDeErrores() {
        if (!this.campo) return [];
        if (!this.campo.errors) return [];
        return Object.keys(this.campo.errors);
    }

    /**
     * Comprueba si el campo a sido tocado si directo no a sido
     * puesto como true. Si ha sido puesto como true retorna true
     * directamete.
     *
     * @returns True si ha sido tocado o directo esta como true.
     * @memberof ValidacionInputsComponent
     */
    touched() {
        if (this.directo) return true;
        if (this.campo) {
            return this.campo.touched;
        }
        return false;
    }

    obtenerMensaje(key: string): string {
        let mensaje!: string;
        if (this.mensaje.hasOwnProperty(key)) mensaje = this.mensaje[key]();
        else mensaje = `Mensaje no definido para ${key}`;
        this.ultimo_mensaje = mensaje;

        return mensaje;
    }
}
