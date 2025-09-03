import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormularioDinamicoCampoComponent } from '../formulario-dinamico-campo/formulario-dinamico-campo.component';
import { FormularioDinamicoService } from 'src/app/services/utiles/formularios/formulario-dinamico/formulario-dinamico.service';
import { CampoBaseFormularioDinamico } from 'src/app/models/utiles/formularios/formulario-dinamico-campo-base.model';
import { CollapsibleElementDirective } from 'src/app/directives/utiles/varios/collapse/collapsible-element.directive';

@Component({
    selector: 'app-formulario-dinamico',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormularioDinamicoCampoComponent,
        CollapsibleElementDirective
    ],
    providers: [FormularioDinamicoService],
    templateUrl: './formulario-dinamico.component.html',
    styleUrl: './formulario-dinamico.component.scss'
})
export class FormularioDinamicoComponent implements OnInit {
    /**
     * La descripcion de los campos a usar.
     */
    @Input() campos: CampoBaseFormularioDinamico<string>[] | null = [];

    /**
     * Si `true`, va a mostrar mensajes y clases
     * de validacion.
     *
     * `true` es el valor por defecto.
     */
    @Input() validar: boolean = true;

    /**
     * Si `true`, va a mostrar un botón de submit.
     *
     * `true` es el valor por defecto.
     */
    @Input() boton_submit: boolean = true;
    @Input() mensaje_boton_submit: string = 'Ok';
    @Input() icono_boton_submit: string = 'bi bi-check2';

    /**
     * Emite el valor del formulario.
     *
     * Si el boton de submit está activado, emite
     * solo cuando este se presiona.
     *
     * Si la validación está activa (`validar`), solo emite
     * cuando el formulario es válido. Esto se puede
     * combinar con la opción del botón de submit.
     */
    @Output('valores') emisor_valores_formulario: EventEmitter<any> =
        new EventEmitter();

    /**
     * Emite la validez del formulario con cada cambio.
     */
    @Output('valido') emisor_validez_formulario: EventEmitter<boolean> =
        new EventEmitter();

    /**
     * Solo emite cuando se le da click al submit.
     */
    @Output('on_submit') click_boton_submit: EventEmitter<null> =
        new EventEmitter();

    constructor(
        private formulario_dinamico_service: FormularioDinamicoService
    ) {}

    ngOnInit(): void {
        this.acciones_de_inicio();
    }

    formulario!: FormGroup;

    get formulario_valido(): boolean {
        return this.formulario.valid;
    }

    acciones_de_inicio() {
        this.crear_formulario();
    }

    crear_formulario() {
        this.formulario = this.formulario_dinamico_service.crear_formulario(
            this.campos as CampoBaseFormularioDinamico<string>[]
        );
    }

    class_columna(indice: number) {
        return this.campos?.at(indice)?.clase_columna;
    }

    emitir_valores_formulario(viene_desde_boton: boolean = false) {
        if (this.boton_submit) {
            if (this.validar) {
                if (this.formulario_valido) {
                    if (viene_desde_boton) {
                        this.emisor_valores_formulario.emit(
                            this.formulario.value
                        );
                    }
                }
            } else if (viene_desde_boton) {
                this.emisor_valores_formulario.emit(this.formulario.value);
            }
        } else if (this.validar) {
            if (this.formulario_valido) {
                this.emisor_valores_formulario.emit(this.formulario.value);
            }
        } else {
            this.emisor_valores_formulario.emit(this.formulario.value);
        }
    }

    emitir_validez_formulario() {
        this.emisor_validez_formulario.emit(this.formulario_valido);
    }

    acciones_de_emision() {
        this.emitir_validez_formulario();
        this.emitir_valores_formulario();
    }

    acciones_de_emision_boton() {
        this.emitir_validez_formulario();
        this.emitir_valores_formulario(true);
        this.click_boton_submit.emit();
    }

    limpiar_todo() {
        this.crear_formulario();
    }
}
