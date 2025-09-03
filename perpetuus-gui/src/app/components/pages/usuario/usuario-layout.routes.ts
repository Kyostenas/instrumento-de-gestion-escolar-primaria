import { Routes } from '@angular/router';
import { PaginaNoEncontrada404Component } from '../general/pagina-no-encontrada-404/pagina-no-encontrada-404.component';

export const USARIO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../../layout/user-layout/user-layout.component').then(
                (x) => x.UserLayoutComponent
            ),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: ''
            },
            { path: '**', component: PaginaNoEncontrada404Component }
        ]
    }
];
