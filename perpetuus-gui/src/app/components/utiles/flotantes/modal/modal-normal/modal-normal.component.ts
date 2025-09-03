import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Modal } from 'bootstrap';

import { ElementoOcultableDirective } from 'src/app/directives/utiles/varios/elemento-ocultable/elemento-ocultable.directive';
import { SwitchBootstrapShowDirective } from 'src/app/directives/utiles/varios/switch-bootstrap-show/switch-bootstrap-show.directive';
import { UtilidadesService } from 'src/app/services/utiles/varios/utilidades/utilidades.service';

/**
 * Para usar este componente es necesario realizar dos pasos.
 *
 * 1. En la vista (html) del componente llamar al selector y dentro poner
 *    el encabezado, cuerpo y pie utilizando la siguiente sintaxis
 *    (poner el id `#appModal`):
 * ``` html
 * <!-- Las medidas pueden ser 'chico' | 'mediano' | 'grande' | 'gigante' -->
 * <app-modal
 *   #appModal
 *   [medida]="tam"
 * >
 *   <div encabezado> <!-- Poner el identificador 'encabezado' -->
 *      <!-- ENCABEZADO -->
 *   </div>
 *   <div contenido> <!-- Poner el identificador 'contenido' -->
 *     <!-- CONTENIDO -->
 *   </div>
 *   <div pie> <!-- Poner el identificador 'pie' -->
 *     <!-- PIE -->
 *   </div>
 * </app-modal>
 * ```
 *
 * 2. En el controlador (ts) del componente, obtener el componente
 *    usando `ViewChild` y el id `#appModal`; usando esta variable se
 *    llamaran las funciones para abrir y cerrar el modal:
 *
 * ```
 * @ViewChild('appModal', {static: false}) appModal: ModalComponent
 *
 * this.appModal.mostrarModal()
 * this.appModal.ocultarModal()
 * ```
 */
@Component({
    selector: 'app-modal-normal',
    imports: [CommonModule, SwitchBootstrapShowDirective],
    templateUrl: './modal-normal.component.html',
    styleUrl: './modal-normal.component.scss'
})
export class ModalNormalComponent {
    constructor(private utiles: UtilidadesService) {}

    ngOnInit() {
        this.__id_modal = this.utiles.crear_bsonobj_id_para_variable();
        this.emisor_id_modal.emit(this.__id_modal);
    }

    private MEDIDAS = {
        chico: 'modal-sm',
        mediano: '',
        grande: 'modal-lg',
        gigante: 'modal-xl'
    };

    private __id_modal!: string;
    private __mostrar_modal: boolean = false;

    /**
     * El id del modal. Puede que este sirva cuando haya
     * varios modales en la misma pagina, en cuyo caso, simplemente
     * renombrar por lo que se desee.
     *
     * @type {string} Defecto: `'modalDetalle'`
     * @memberof ModalNormalComponent
     */
    // @Input() idModal: string = 'modalDetalle'

    /**
     * El tamaño del modal a crear
     *
     * @type {string} Defecto: `'mediano'`
     * @memberof ModalNormalComponent
     */
    @Input() medida: 'chico' | 'mediano' | 'grande' | 'gigante' = 'grande';
    /**
     * Define cuando se va a mostrar el modal. (No confundir con la aparcion, si no con el ngIf para
     * que el elementoi no lanze errores).
     *
     * @type {boolean} Defecto: `'true'`
     * @memberof ModalNormalComponent
     */
    @Input() mostrarContenido: boolean = true; // FIX: No funciona correctamente
    /**
     * Quitar el encabezado.
     *
     * @type {boolean} Defecto: `false`
     * @memberof ModalNormalComponent
     */
    @Input() ocultarEncabezado: boolean = false;
    /**
     * Quitar el pié de página del modal
     *
     * @type {boolean} Defecto: `true`
     * @memberof ModalNormalComponent
     */
    @Input() ocultarPie: boolean = true;
    /**
     * Si esto se pone como `false`, no se podrá
     * cerra el modal con teclado ni dando click afuera de
     * él, solo en el botón de cerrar o atravez de la
     * funcion `ocultarModal`
     *
     * @type {boolean} Defecto: `true`
     * @memberof ModalNormalComponent
     */
    @Input() permitirCerrarFueraDeModal: boolean = true;
    @Input() set abrir_modal(value: boolean) {
        if (!value) {
            if (!this.__mostrando_modal) {
                this.mostrar_modal();
            }
        } else {
            if (this.__mostrando_modal) {
                this.ocultar_modal();
            }
        }
    }

    /**
     * Genera una emision cuando se le da click
     * al boton de cerrar o se cierra el modal al dar
     * click fuera de este (si esta activa la opcion)
     *
     * @memberof ModalNormalComponent
     */
    @Output('cerrar') emisorClickBotonCerrar: EventEmitter<null> =
        new EventEmitter();
    /**
     * Genera emision cuando se le da click al
     * cuadro de dialogo del modal
     *
     * @memberof ModalNormalComponent
     */
    @Output('click_dialogo') emisor_click_cuadro_dialogo: EventEmitter<null> =
        new EventEmitter();
    @Output('id_modal') emisor_id_modal: EventEmitter<string> =
        new EventEmitter();

    get dataBackdrop() {
        return this.permitirCerrarFueraDeModal ? 'initial' : 'static';
    }

    get claseMedida() {
        return this.MEDIDAS[this.medida];
    }

    get id_modal(): string {
        return this.__id_modal;
    }

    get se_muestra_modal(): boolean {
        return this.__mostrar_modal;
    }

    get elemento_modal(): Modal {
        const elemento_modal = document.getElementById(
            this.id_modal
        ) as HTMLElement;
        const modal = new Modal(elemento_modal);
        return modal;
    }

    get clase_mostrando(): string {
        return this.__mostrando_modal ? 'mostrando-modal' : '';
    }

    private solo_boton: boolean = false;
    emitirClickCerrarBoton() {
        this.solo_boton = true;
        this.emisorClickBotonCerrar.emit();
        this.__mostrando_modal = false;
    }

    emitirClickCerrarAreaModal() {
        if (!this.solo_boton && !this.detener_emision) {
            this.emisorClickBotonCerrar.emit();
            this.__mostrando_modal = false;
        } else {
            this.solo_boton = false;
            this.detener_emision = false;
        }
    }

    private detener_emision: boolean = false;
    emitir_click_cuadro_dialogo() {
        this.detener_emision = true;
        this.emisor_click_cuadro_dialogo.emit();
    }

    private __mostrando_modal: boolean = false;

    mostrar_modal() {
        this.elemento_modal.show();
        this.__mostrando_modal = true;
    }

    ocultar_modal() {
        this.elemento_modal.hide();
        this.__mostrando_modal = false;
    }
}
