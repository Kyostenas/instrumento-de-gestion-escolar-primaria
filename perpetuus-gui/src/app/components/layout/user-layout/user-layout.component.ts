import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/inicio/signin/auth.service';

@Component({
    selector: 'app-user-layout',
    imports: [],
    templateUrl: './user-layout.component.html',
    styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent implements OnInit {
    constructor(
        private auth_service: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.auth_service.validar_sesion().subscribe({
            next: (sesion_es_valida) => {
                if (!sesion_es_valida) {
                    this.router.navigate(['inicio/signin']);
                }
            },
            error: (err) => this.router.navigate(['inicio/signin'])
        });
    }
}
