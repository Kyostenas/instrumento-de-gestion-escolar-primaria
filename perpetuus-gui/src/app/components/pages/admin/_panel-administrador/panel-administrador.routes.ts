import { Routes } from '@angular/router';

export const PANEL_ADMINISTRACION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import(
                '../../admin-usuario/panel-de-sub-menus/panel-de-sub-menus.component'
            ).then((x) => x.PanelDeSubMenusComponent),
        children: [
            {
                path: 'roles',
                loadComponent: () =>
                    import(
                        './administracion-roles/administracion-roles.component'
                    ).then((x) => x.AdministracionRolesComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () =>
                    import(
                        './user/user-administration-list/user-administration-list.component'
                    ).then((x) => x.UserAdministrationListComponent)
            },
            {
                path: 'usuarios/form',
                loadComponent: () =>
                    import(
                        './user/user-administration-form/user-administration-form.component'
                    ).then((x) => x.UserAdministrationFormComponent)
            },
            {
                path: 'parametros',
                loadComponent: () =>
                    import(
                        './administracion-parametros/administracion-parametros.component'
                    ).then((x) => x.AdministracionParametrosComponent)
            },
            {
                path: 'areas',
                loadComponent: () =>
                    import(
                        './administracion-areas/administracion-areas.component'
                    ).then((x) => x.AdministracionAreasComponent)
            },
            {
                path: 'flujos',
                loadComponent: () =>
                    import(
                        './administracion-flujos/administracion-flujos.component'
                    ).then((x) => x.AdministracionFlujosComponent)
            },
            {
                path: 'almacenes',
                loadChildren: () =>
                    import('./_almacenes/administracion-almacenes.routes').then(
                        (rutas) => rutas.ADMINSITRACION_ALMACENES_ROUTES
                    )
            },
            { path: '**', redirectTo: '../' }
        ]
    }
];
