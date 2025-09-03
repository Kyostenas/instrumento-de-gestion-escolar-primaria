import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import ObjectID from 'bson-objectid';
import { SwitchBootstrapShowDirective } from 'src/app/directives/utiles/varios/switch-bootstrap-show/switch-bootstrap-show.directive';
import { BarraLateralMenuComponent } from '../barra-lateral-menu/barra-lateral-menu.component';

export type LinkTextoBarraSuperior = {
    texto: string;
    href: string;
};

export type LinkSimboloBarraSuperior = {
    texto: string;
    href?: string;
    simbolo: string;
    data_bs_toggle?: string;
    data_bs_target?: string;
};

@Component({
    selector: 'app-barra-superior',
    imports: [
        CommonModule,
        BarraLateralMenuComponent
        // SwitchBootstrapShowDirective,
    ],
    templateUrl: './barra-superior.component.html',
    styleUrl: './barra-superior.component.scss'
})
export class BarraSuperiorComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        this.crear_ids();
    }

    @Input() links_texto: LinkTextoBarraSuperior[] = [];
    @Input() links_simbolo: LinkSimboloBarraSuperior[] = [];
    @Input() forzar_offcanvas: boolean = false;
    @Input() posicion_offcanvas: 'start' | 'end' | 'top' | 'bottom' = 'end';
    @Input() sticky: boolean = true;

    get clase_mostrar_offcanvas() {
        let clase_base = this.forzar_offcanvas ? '' : 'offcanvas-lg';
        let clase_posicion = 'offcanvas-'.concat(this.posicion_offcanvas);
        let clases_unidas = [clase_base, clase_posicion].join(' ');
        return clases_unidas;
    }

    get clase_sticky() {
        return this.sticky ? 'sticky-top' : '';
    }

    get id_offcanvas(): string {
        return 'a'.concat(this._id_offcanvas);
    }

    private _id_offcanvas!: string;
    crear_ids(): void {
        this._id_offcanvas = new ObjectID().toHexString();
    }
}
