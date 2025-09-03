import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Pipe,
    signal,
    TemplateRef,
    WritableSignal
} from '@angular/core';
import { BootstrapDropdownDirective } from 'src/app/directives/utiles/varios/bootsrap-dropdown/bootstrap-dropdown.directive';
import { BootstrapTooltipDirective } from 'src/app/directives/utiles/varios/bootstrap-tooltip/bootstrap-tooltip.directive';
import { PipeDinamicoPipe } from 'src/app/pipes/utiles/pipe-dinamico/pipe-dinamico.pipe';
import { ControlQueriesUrlService } from 'src/app/services/utiles/estructurales/control-queries-url/control-queries-url.service';
import { DeteccionViewportService } from 'src/app/services/utiles/estructurales/deteccion-viewport/deteccion-viewport.service';
import { UtilidadesService } from 'src/app/services/utiles/varios/utilidades/utilidades.service';
import { DeepKeys, Pagination } from 'src/app/utiles/tipos-personalizados';
import { PaginadorGenericoComponent } from '../paginador-generico/paginador-generico.component';

@Component({
    selector: 'app-tabla-generica',
    imports: [
        BootstrapDropdownDirective,
        BootstrapTooltipDirective,
        CommonModule,
        PipeDinamicoPipe,
        PaginadorGenericoComponent
    ],
    templateUrl: './tabla-generica.component.html',
    styleUrl: './tabla-generica.component.scss'
})
export class TablaGenericaComponent implements OnInit, OnDestroy {
    constructor(
        private utiles: UtilidadesService,
        private viewport: DeteccionViewportService,
        private cdr: ChangeDetectorRef,
        private control_queries: ControlQueriesUrlService
    ) {
        // this.control_queries.queries.paginacion.accion.definir()
        // this.control_queries.queries.filtros<Paginacion>().accion.definir()
        effect(() => {
            const QUERY_OBTENIDA =
                this.control_queries.query_actual().pagination;
            if (QUERY_OBTENIDA) {
                this.ordenes_columnas.update(
                    () => QUERY_OBTENIDA.sorting_fields
                );
                this.detallePaginacion.update((value) => QUERY_OBTENIDA);
            }
            this.emisor_paginacion.emit(QUERY_OBTENIDA);
        });
    }

    ngOnInit(): void {
        if (!this.control_queries.query_actual().pagination) {
            const QUERY_DEFECTO = {
                limit: 5,
                from: 0,
                current_page: 1,
                element_count: 0,
                page_count: 0,
                sorting_fields: {}
            };
            this.detallePaginacion.update((value) => QUERY_DEFECTO);
            this.emisor_paginacion.emit(QUERY_DEFECTO);
            this.control_queries.queries.pagination.accion.definir(
                QUERY_DEFECTO
            );
        } else {
            const QUERY_OBTENIDA =
                this.control_queries.query_actual().pagination;
            if (QUERY_OBTENIDA) {
                this.detallePaginacion.update((value) => QUERY_OBTENIDA);
            }
            this.emisor_paginacion.emit(QUERY_OBTENIDA);
        }
    }

    ngOnDestroy(): void {
        this.control_queries.queries.pagination.accion.ocultar();
    }

    // (o==================================================================o)
    //   #region VARIABLES (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    // (o-----------------------------------------( INPUTS Y OUTPUTS ))

    datos_tabla: WritableSignal<OPCIONES_TABLA_GENERICA<any>> = signal({
        columns: [],
        documentos: []
    });
    columnas_computed = computed(() => this.datos_tabla().columns);
    @Input('datos_tabla')
    set _datos_tabla(datos: OPCIONES_TABLA_GENERICA<any>) {
        this.sobreescribir_valores_por_defecto(datos);
        this.datos_tabla.update((current_value) => ({
            ...current_value,
            ...datos
        }));
    }
    @Input('documentos') documentos: any[] = [];
    @Output('paginacion')
    emisor_paginacion: EventEmitter<Pagination> = new EventEmitter();
    @Output('click_fila')
    emisor_click_fila: EventEmitter<OPCIONES_FILA_TABLA_GENERICA<any>> =
        new EventEmitter();

    // (o-----------------------------------------( SOLO VARIABLES ))

    modo: WritableSignal<'tabla' | 'columnas'> =
        this.viewport.modo_tabla_generica;
    modo_viewport: WritableSignal<'movil' | 'escritorio'> =
        this.viewport.modo_viewport;
    ordenes_columnas: WritableSignal<Pagination['sorting_fields']> = signal({});
    // datos_tabla!: OPCIONES_TABLA_GENERICA
    detallePaginacion: WritableSignal<Pagination> = signal({
        from: 0,
        limit: 5,
        current_page: 1,
        element_count: 0,
        page_count: 0,
        sorting_fields: {}
    });

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region ORDENAMIENTO DE COLUMNAS (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    ordenar_ascendente(column_field: string, nombre_real: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            value[column_field] = {
                field: column_field,
                title: nombre_real,
                order: -1
            };
            return value;
        });
        this.emitir_ordenamiento();
    }

    ordenar_descendente(column_field: string, nombre_real: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            value[column_field] = {
                field: column_field,
                title: nombre_real,
                order: 1
            };
            return value;
        });
        this.emitir_ordenamiento();
    }

    no_ordenar(column_field: string) {
        this.ordenes_columnas.update((value: Pagination['sorting_fields']) => {
            delete value[column_field];
            return value;
        });
        this.emitir_ordenamiento();
    }

    emitir_ordenamiento() {
        let paginacion: Pagination = {
            ...this.detallePaginacion(),
            sorting_fields: this.ordenes_columnas()
        };
        this.detallePaginacion.update((value) => paginacion);
        this.control_queries.queries.pagination.accion.definir(paginacion);
        this.emisor_paginacion.emit(paginacion);
    }

    resultado_paginacion_paginador(resultado_paginacion: Pagination) {
        let paginacion: Pagination = {
            ...resultado_paginacion,
            sorting_fields: this.ordenes_columnas()
        };
        // this.detallePaginacion.update((value) => paginacion);
        this.control_queries.queries.pagination.accion.definir(paginacion);
        // this.emisor_paginacion.emit(paginacion);
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion ORDENAMIENTO DE COLUMNAS (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region ACCIONES TABLA (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    definir_modo(modo: 'tabla' | 'columnas') {
        this.modo.update(() => modo);
    }

    definir_cantidad_columnas(cantidad: 1 | 2 | 3 | 4 | 5 = 3) {}

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion ACCIONES TABLA (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VALORES POR DEFECTO (INICIO)
    // (o-----------------------------------------------------------\/-----o)

    sobreescribir_valores_por_defecto(datos: OPCIONES_TABLA_GENERICA<any>) {
        this.si_no_existe(datos, 'mostrar_boton_seleccion', false);
        this.si_no_existe(datos, 'mostrar_boton_copia_portapapeles', true);
        this.si_no_existe(datos, 'mostrar_boton_descarga_excel', true);
        this.si_no_existe(datos, 'mostrar_boton_descarga_pdf', true);
        this.si_no_existe(datos, 'mostrar_boton_layout', true);
        this.si_no_existe(datos, 'mostrar_indice_fila', false);
        this.si_no_existe(datos, 'mostrar_paginador', true);
        this.si_no_existe(datos, 'mostrar_buscador', true);
        this.si_no_existe(datos, 'posicion_sub_titulo', 'bottom');
        this.si_no_existe(datos, 'mostrar_ordenadores', true);
    }

    si_no_existe(datos: any, valor_buscar: string, reemplazo_por_si_no: any) {
        if (
            !(datos[valor_buscar] !== undefined && datos[valor_buscar] !== null)
        ) {
            datos[valor_buscar] = reemplazo_por_si_no;
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VALORES POR DEFECTO (FIN)
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region CLICK
    // (o-----------------------------------------------------------\/-----o)

    emmit_click(index: number, document: any) {
        this.emisor_click_fila.emit({
            row_index: index,
            row_document: document
        });
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion CLICK
    // (o==================================================================o)
}

export interface CLICK_FILA_TABLA_GENERICA {}

export interface COLUMNA_TABLA_GENERICA<OBJETO> {
    alignment?: 'left' | 'center' | 'right';
    header_tooltip?: TOOLTIP_TABLA_GENERICA;
    avoid_click_detection?: boolean;
    content: CONTENIDO_TABLA_GENERICA<OBJETO>;
    column_title: string;
}

export interface TOOLTIP_TABLA_GENERICA {
    content?: string;
    content_callback?: any;
    pipe?: Pipe;
    pipe_args?: any[];
    template_tooltip?: TemplateRef<any>;
}

export interface CONTENIDO_TABLA_GENERICA<OBJETO> {
    class_callback?: any;
    template?: TemplateRef<any>;
    callback?: any;
    pipe?: Pipe;
    pipe_args?: any[];
    field: DeepKeys<OBJETO>;
    tooltip?: TOOLTIP_TABLA_GENERICA;
}

export interface OPCIONES_FILA_TABLA_GENERICA<T> {
    row_index: number;
    row_document: T;
}

export interface OPCIONES_TABLA_GENERICA<OBJETO> {
    row_options?: OPCIONES_FILA_TABLA_GENERICA<OBJETO>;
    table_title?: string;
    table_sub_title?: string;
    sub_title_position?: 'inicio' | 'fin';
    show_pagination?: boolean;
    show_search_bar?: boolean;
    show_selection_button?: boolean;
    show_copy_button?: boolean;
    show_excel_button?: boolean;
    show_pdf_button?: boolean;
    show_layout_button?: boolean;
    show_index_column?: boolean;
    show_sorters?: boolean;
    columns: COLUMNA_TABLA_GENERICA<OBJETO>[];
}
