import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../../layout/admin-layout/admin-layout.component').then(
                (x) => x.AdminLayoutComponent
            ),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import(
                        '../admin-usuario/dashboard/dashboard.component'
                    ).then((x) => x.DashboardComponent)
            },
            {
                path: 'panel-administrador',
                loadChildren: () =>
                    import(
                        './_panel-administrador/panel-administrador.routes'
                    ).then((rutas) => rutas.PANEL_ADMINISTRACION_ROUTES)
            }
        ]
    }
];
