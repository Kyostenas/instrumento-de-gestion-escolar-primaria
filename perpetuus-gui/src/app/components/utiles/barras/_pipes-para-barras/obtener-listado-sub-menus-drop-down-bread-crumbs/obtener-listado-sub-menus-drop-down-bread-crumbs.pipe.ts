import { Pipe, PipeTransform } from '@angular/core';
import { DESCRIPCION_MENU } from 'src/app/models/usuario/usuario.model';

@Pipe({
    name: 'sub_menus_breadcrumb_dropdown',
    standalone: true
})
export class ObtenerListadoSubMenusDropDownBreadCrumbsPipe
    implements PipeTransform
{
    transform(menu: DESCRIPCION_MENU, menu_actual: DESCRIPCION_MENU): string {
        if (!!menu.sub_menus) {
            const LISTA = menu.sub_menus
                .map((sub_menu) => {
                    return `
            <li><a 
                [routerLink]="['${sub_menu.ruta_completa}']" 
                [routerLinkActive]="'${sub_menu.link !== menu_actual.link ? 'router-link-active' : ''}'" 
                class="dropdown-item ${sub_menu.link === menu_actual.link ? 'active' : ''}"
              >
                <i class="${sub_menu.simbolo}"></i>
                ${sub_menu.nombre}
              </a></li>
            `;
                })
                .join('');
            return LISTA;
        } else {
            return '<li><a class="dropdown-item"><i class="bi bi-ban"></i></a></li>';
        }
    }
}
