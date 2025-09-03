import { Routes } from '@angular/router';
import { PaginaNoEncontrada404Component } from './components/pages/general/pagina-no-encontrada-404/pagina-no-encontrada-404.component';

// const appRoutes: Routes = [

// ];

// export const APP_ROUTES = RouterModule.forRoot(appRoutes, {
//     useHash: false,
// setupTestingRouter: undefined,
// canceledNavigationResolution: undefined,
// paramsInheritanceStrategy: undefined,
// titleStrategy: undefined,
// urlUpdateStrategy: undefined,
// urlHandlingStrategy: undefined,
// malformedUriErrorHandler: undefined,
// });

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
    },
    {
        path: 'inicio',
        loadChildren: () =>
            import(
                './components/pages/inicio/inicio-public-layout.routes'
            ).then((rutas) => rutas.INICIO_ROUTES)
    },
    {
        path: 'usuario',
        loadChildren: () =>
            import('./components/pages/usuario/usuario-layout.routes').then(
                (rutas) => rutas.USARIO_ROUTES
            )
    },
    {
        path: 'administracion',
        loadChildren: () =>
            import('./components/pages/admin/admin-layout.routes').then(
                (rutas) => rutas.ADMIN_ROUTES
            )
    },
    { path: '*', redirectTo: '' },
    { path: '**', component: PaginaNoEncontrada404Component }
];
