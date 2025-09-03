import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormularioDinamicoComponent } from 'src/app/components/utiles/formularios/formulario-dinamico/formulario-dinamico.component';
import { CardComponent } from 'src/app/components/utiles/card/card/card.component';
import {
    CampoBaseFormularioDinamico,
    CampoFormulario
} from 'src/app/models/utiles/formularios/formulario-dinamico-campo-base.model';
import { AuthService } from 'src/app/services/inicio/signin/auth.service';

@Component({
    selector: 'app-signin',
    imports: [FormularioDinamicoComponent, CardComponent],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {
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

    datos_formulario: CampoBaseFormularioDinamico<string>[] = [
        new CampoFormulario({
            llave: 'nombre_usuario',
            etiqueta: 'Usuario',
            tipo: 'text',
            clase_columna: 'col-12',
            clase_input: 'tw-bg-gray-800/40'
        }),
        new CampoFormulario({
            llave: 'contrasena',
            etiqueta: 'Contraseña',
            tipo: 'password',
            clase_input: 'tw-bg-gray-800/40'
        })
    ];

    get datos_formulario_json_string(): string {
        return JSON.stringify(this.datos_formulario, undefined, 2);
    }

    valores_formulario!: any;
    guardar_valores_formulario(evento: any) {
        this.valores_formulario = evento as any;
    }

    on_submit() {
        this.iniciar_sesion();
    }

    iniciar_sesion() {
        this.auth_service
            .iniciar_sesion(this.valores_formulario)
            .subscribe((datos_usuario) => {
                this.limpiar_formulario();
                const USUARIO = datos_usuario.usuario;
                if (USUARIO.rol?.super_admin) {
                    this.router.navigate(['administracion']);
                } else {
                    this.router.navigate(['usuario']);
                }
                let rol_usuario = USUARIO.rol;
                let menu_usuario = datos_usuario.menus;
                delete USUARIO.rol;
                localStorage.setItem('usuario', JSON.stringify(USUARIO));
                localStorage.setItem(
                    'rol_usuario',
                    JSON.stringify(rol_usuario)
                );
                localStorage.setItem('menus', JSON.stringify(menu_usuario));
            });
    }

    // (o==================================================================o)
    //   CONTROL DIRECTO DEL FORMULARIO (INICIO)
    //   usando su componente
    // (o-----------------------------------------------------------\/-----o)

    @ViewChild('app_formulario_dinamico', { static: false })
    app_formulario_dinamico!: FormularioDinamicoComponent;

    limpiar_formulario() {
        this.app_formulario_dinamico.limpiar_todo();
    }

    // (o-----------------------------------------------------------/\-----o)
    //   CONTROL DIRECTO DEL FORMULARIO (FIN)
    // (o==================================================================o)
}
