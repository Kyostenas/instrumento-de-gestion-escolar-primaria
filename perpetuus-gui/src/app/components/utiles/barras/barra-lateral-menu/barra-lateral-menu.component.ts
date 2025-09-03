import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BootstrapTooltipDirective } from 'src/app/directives/utiles/varios/bootstrap-tooltip/bootstrap-tooltip.directive';
import { DESCRIPCION_MENU } from 'src/app/models/usuario/usuario.model';
import { DeteccionViewportService } from 'src/app/services/utiles/estructurales/deteccion-viewport/deteccion-viewport.service';
import { FragmentCallbackService } from 'src/app/services/utiles/estructurales/fragment-callback/fragment-callback.service';
import { UtilidadesService } from 'src/app/services/utiles/varios/utilidades/utilidades.service';

@Component({
    selector: 'app-barra-lateral-menu',
    imports: [CommonModule, BootstrapTooltipDirective, RouterModule],
    templateUrl: './barra-lateral-menu.component.html',
    styleUrl: './barra-lateral-menu.component.scss'
})
export class BarraLateralMenuComponent implements OnInit {
    constructor(
        private utiles: UtilidadesService,
        private fragmentos: FragmentCallbackService,
        private viewport: DeteccionViewportService
    ) {}

    ngOnInit(): void {
        this.lista_menu = this.utiles.consultar_local_storage('menus');
    }

    modo_viewport: WritableSignal<'movil' | 'escritorio'> =
        this.viewport.modo_viewport;

    agregar_framento(
        fragmento: DeepValues<typeof this.fragmentos.ALLOWED_FRAGMENTS, string>
    ) {
        this.fragmentos.add_fragment(fragmento);
    }

    lista_menu!: DESCRIPCION_MENU[];
}
