import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/inicio/signin/auth.service';

@Component({
    selector: 'app-landing',
    imports: [],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
    constructor(
        private auth_service: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.auth_service.validar_sesion().subscribe((sesion_es_valida) => {
            if (sesion_es_valida) {
                let rol = this.auth_service.obtener_rol_usuario_local_storage();
                if (rol.super_admin) {
                    this.router.navigate(['administracion']);
                } else {
                    this.router.navigate(['usuario']);
                }
            }
        });
    }
}
