import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    OnInit,
    Signal,
    WritableSignal
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/inicio/signin/auth.service';
import { BarraLateralMenuComponent } from '../../utiles/barras/barra-lateral-menu/barra-lateral-menu.component';
import { BarraBreadcrumbsComponent } from '../../utiles/barras/barra-breadcrumbs/barra-breadcrumbs.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeteccionViewportService } from 'src/app/services/utiles/estructurales/deteccion-viewport/deteccion-viewport.service';
import {
    ControlQueriesUrlService,
    QUERY_PARAMS_GENERAL
} from 'src/app/services/utiles/estructurales/control-queries-url/control-queries-url.service';
import { CollapsibleElementDirective } from 'src/app/directives/utiles/varios/collapse/collapsible-element.directive';

@Component({
    selector: 'app-admin-layout',
    imports: [
        CommonModule,
        RouterModule,
        BarraLateralMenuComponent,
        BarraBreadcrumbsComponent,
        CollapsibleElementDirective
    ],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
    // (o==================================================================o)
    //   #region INITIALIZATION
    // (o-----------------------------------------------------------\/-----o)

    constructor(
        private auth_service: AuthService,
        private router: Router,
        private viewport_service: DeteccionViewportService,
        private url_query_service: ControlQueriesUrlService
    ) {
        this.valid_session = toSignal(this.auth_service.validar_sesion());
    }

    ngOnInit(): void {
        this.auth_service.validar_sesion().subscribe({
            next: (sesion_es_valida) => {
                if (!sesion_es_valida) {
                    this.router.navigate(['inicio/signin']);
                }
            },
            error: (error) => this.router.navigate(['inicio/signin'])
        });
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion INITIALIZATION
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region VARIABLES
    // (o-----------------------------------------------------------\/-----o)

    modo_viewport: WritableSignal<'movil' | 'escritorio'> =
        this.viewport_service.modo_viewport;
    valid_session!: Signal<boolean | undefined>;
    mostrar_boton_top: boolean = false;
    elemento_scroll!: HTMLElement;
    using_side_panel: Signal<QUERY_PARAMS_GENERAL['use_side_panel']> = computed(
        () => {
            return !!this.url_query_service.query_actual().use_side_panel;
        }
    );

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion VARIABLES
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region BUTTON SCROLL UP
    // (o-----------------------------------------------------------\/-----o)

    scroll_ventana(event: Event) {
        if (!this.elemento_scroll)
            this.elemento_scroll = event.target as HTMLElement;
        if (this.elemento_scroll.scrollTop > 100) {
            this.mostrar_boton_top = true;
        } else {
            this.mostrar_boton_top = false;
        }
    }

    scroll_hasta_arriba() {
        this.elemento_scroll.scrollTo({ top: 0, behavior: 'instant' });
        window.scrollTo({ top: 0 });
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion BUTTON SCROLL UP
    // (o==================================================================o)

    // (o==================================================================o)
    //   #region QUERY READING
    // (o-----------------------------------------------------------\/-----o)

    subscribe_to_panel_query() {
        this.url_query_service.query_actual();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   #endregion QUERY READING
    // (o==================================================================o)
}
