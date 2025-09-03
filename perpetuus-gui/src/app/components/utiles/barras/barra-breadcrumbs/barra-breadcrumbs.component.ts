import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DESCRIPCION_MENU } from 'src/app/models/usuario/usuario.model';
import { ControlBreadcrumbsService } from 'src/app/services/utiles/estructurales/control-breadcrumbs/control-breadcrumbs.service';

@Component({
    selector: 'app-barra-breadcrumbs',
    imports: [CommonModule, RouterModule],
    templateUrl: './barra-breadcrumbs.component.html',
    styleUrl: './barra-breadcrumbs.component.scss'
})
export class BarraBreadcrumbsComponent implements OnInit, OnDestroy {
    constructor(public breadcrumb_service: ControlBreadcrumbsService) {}

    ngOnInit(): void {
        this.suscribirse_menus_actuales();
    }

    ngOnDestroy(): void {
        this.subscripcion_list_menus.unsubscribe();
        this.subscripcion_menu_actual.unsubscribe();
        this.subscripcion_sub_menus_actual.unsubscribe();
    }

    lista_menu_actuales!: DESCRIPCION_MENU[];
    menu_actual!: DESCRIPCION_MENU;
    private _sub_menus_disponibles!: DESCRIPCION_MENU[];
    private subscripcion_list_menus!: Subscription;
    private subscripcion_menu_actual!: Subscription;
    private subscripcion_sub_menus_actual!: Subscription;

    // get menus_actuales(): {[ key: string]: DESCRIPCION_MENU } {
    //   return this._lista_menu_actuales
    // }

    // get menu_actual(): DESCRIPCION_MENU {
    //   return this._menu_actual
    // }

    suscribirse_menus_actuales() {
        this.subscripcion_list_menus =
            this.breadcrumb_service.estado_ruta_menus_actual$.subscribe({
                next: (lista_actual) => {
                    let valores = Object.values(lista_actual).sort(
                        (a, b) => a.nivel - b.nivel
                    );
                    this.lista_menu_actuales = valores;
                }
            });
        this.subscripcion_menu_actual =
            this.breadcrumb_service.estado_menu_actual$.subscribe({
                next: (menu_actual) => {
                    // console.log(menu_actual)
                    this.menu_actual = menu_actual;
                }
            });
        this.subscripcion_sub_menus_actual =
            this.breadcrumb_service.estado_conjunto_sub_menus_disponibles$.subscribe(
                {
                    next: (sub_menus) => {
                        this._sub_menus_disponibles = sub_menus;
                    }
                }
            );
    }
}
