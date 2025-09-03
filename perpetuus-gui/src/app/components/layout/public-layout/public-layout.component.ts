import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    BarraSuperiorComponent,
    LinkSimboloBarraSuperior,
    LinkTextoBarraSuperior
} from '../../utiles/barras/barra-superior/barra-superior.component';
import { CommonModule } from '@angular/common';
import { BarraInferiorComponent } from '../../utiles/barras/barra-inferior/barra-inferior.component';

@Component({
    selector: 'app-public-layout',
    imports: [
        CommonModule,
        RouterModule,
        BarraSuperiorComponent,
        BarraInferiorComponent
    ],
    templateUrl: './public-layout.component.html',
    styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {
    links_texto: LinkTextoBarraSuperior[] = [
        {
            texto: 'Ingresar',
            href: 'inicio/signin'
        },
        {
            texto: 'Registrarse',
            href: 'inicio/signup'
        }
    ];

    links_simbolo: LinkSimboloBarraSuperior[] = [
        {
            texto: 'Github',
            href: 'https://github.com/Kyostenas/perpetuus-gui',
            simbolo: 'bi-github'
        }
    ];
}
