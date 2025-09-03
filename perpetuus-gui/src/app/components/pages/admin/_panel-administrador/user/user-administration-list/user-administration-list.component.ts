import { CommonModule, UpperCasePipe } from '@angular/common';
import {
    Component,
    effect,
    Signal,
    signal,
    WritableSignal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    TablaGenericaComponent,
    OPCIONES_TABLA_GENERICA,
    OPCIONES_FILA_TABLA_GENERICA
} from 'src/app/components/utiles/varios/tabla-generica/tabla-generica.component';
import { UsuarioRecibir } from 'src/app/models/usuario/usuario.model';
import { AdministracionUsuariosService } from 'src/app/services/admin/administracion-usuarios/administracion-usuarios.service';
import { StandardRoutingService } from 'src/app/services/utiles/estructurales/standard-routing/standard-routing.service';
import { Pagination } from 'src/app/utiles/tipos-personalizados';

@Component({
    selector: 'app-user-administration-list',
    imports: [TablaGenericaComponent, CommonModule],
    templateUrl: './user-administration-list.component.html',
    styleUrl: './user-administration-list.component.scss'
})
export class UserAdministrationListComponent {
    // (o==================================================================o)
    //   #region INIT
    // (o-----------------------------------------------------------\/-----o)

    constructor(
        private usuario_service: AdministracionUsuariosService,
        private routing_service: StandardRoutingService
    ) {
        effect(() => {
            // this.paginacion()
            // console.log('PUES ASI NO')
            // this.usuarios = toSignal(
            //     this.usuario_service.obtener_usuarios(this.paginacion())
            // );
        });
        this.usuarios = toSignal(this.usuario_service.obtener_usuarios());
    }

    ngOnInit(): void {
        this.crear_datos_tabla();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INIT
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VARIABLES
    // (o-----------------------------------------------------------\/-----o)

    usuarios!: Signal<UsuarioRecibir[] | undefined>;
    datos_tabla_generica!: OPCIONES_TABLA_GENERICA<UsuarioRecibir>;
    paginacion!: WritableSignal<Pagination>;

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region GENERIC TABLE
    // (o-----------------------------------------------------------\/-----o)

    crear_datos_tabla() {
        this.datos_tabla_generica = {
            columns: [
                {
                    column_title: 'NOMBRE',
                    content: {
                        field: 'rol.super_admin'
                    },
                    header_tooltip: {
                        content: 'El nombre real del usuario',
                        pipe: UpperCasePipe
                    }
                },
                {
                    column_title: 'USUARIO',
                    content: {
                        field: 'nombre_usuario'
                    },
                    header_tooltip: {
                        content:
                            'El identificador del usuario dentro del sistema'
                    }
                },
                {
                    column_title: 'CORREO',
                    content: {
                        field: 'correo'
                    },
                    header_tooltip: {
                        content:
                            'Un correo electrónico válido proveído por el usuario'
                    }
                },
                {
                    column_title: 'NÚMERO CELULAR',
                    content: {
                        field: 'numero_celular'
                    },
                    header_tooltip: {
                        content:
                            'Un número de celular válido proveído por el usuario'
                    }
                }
            ],
            show_index_column: true,
            show_sorters: true
        };
    }

    cambiar_ordenamiento(paginacion: Pagination) {
        try {
            this.paginacion.update((value) => paginacion);
        } catch (err) {
            this.paginacion = signal(paginacion);
        }
    }

    accion_click_fila(datos: OPCIONES_FILA_TABLA_GENERICA<UsuarioRecibir>) {
        if (datos.row_document.sequence !== undefined) {
            this.routing_service.open_form(datos.row_document.sequence);
        }
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion GENERIC TABLE
    // (o==================================================================o)
}
