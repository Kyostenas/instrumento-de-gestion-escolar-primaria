import { Routes } from '@angular/router';
import { PaginaNoEncontrada404Component } from '../general/pagina-no-encontrada-404/pagina-no-encontrada-404.component';

export const INICIO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../../layout/public-layout/public-layout.component').then(
                (x) => x.PublicLayoutComponent
            ),
        providers: [],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./landing/landing.component').then(
                        (x) => x.LandingComponent
                    )
            },
            {
                path: 'signin',
                loadComponent: () =>
                    import('./signin/signin.component').then(
                        (x) => x.SigninComponent
                    )
            },
            // {
            //     path: 'signup',
            //     loadComponent: () => import('./signup/signup.component')
            //         .then(x => x.SignupComponent),
            // },
            { path: '**', component: PaginaNoEncontrada404Component }
        ]
    }
];
