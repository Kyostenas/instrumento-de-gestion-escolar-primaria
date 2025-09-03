import { Routes } from '@angular/router';
import { PaginaNoEncontrada404Component } from '../../../general/pagina-no-encontrada-404/pagina-no-encontrada-404.component';

export const ADMINSITRACION_ALMACENES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import(
                '../../../admin-usuario/panel-de-sub-menus/panel-de-sub-menus.component'
            ).then((x) => x.PanelDeSubMenusComponent),
        children: [
            {
                path: 'administrar',
                loadComponent: () =>
                    import(
                        './administracion-almacenes/administracion-almacenes.component'
                    ).then((x) => x.AdministracionAlmacenesComponent)
            },
            {
                path: 'articulos',
                loadComponent: () =>
                    import(
                        './administracion-articulos/administracion-articulos.component'
                    ).then((x) => x.AdministracionArticulosComponent)
            },
            { path: '**', redirectTo: '../' }
        ]
    }
];
