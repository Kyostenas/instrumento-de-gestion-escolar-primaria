import { Component, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormularioDinamicoComponent } from 'src/app/components/utiles/formularios/formulario-dinamico/formulario-dinamico.component';
import { CardComponent } from 'src/app/components/utiles/card/card/card.component';
import { UsuarioEnviar } from 'src/app/models/usuario/usuario.model';
import {
    CampoBaseFormularioDinamico,
    CampoFormulario
} from 'src/app/models/utiles/formularios/formulario-dinamico-campo-base.model';
import { AuthService } from 'src/app/services/inicio/signin/auth.service';
import { REGEX_VALIDACION_CORREO } from 'src/app/services/utiles/varios/utilidades/utilidades.service';

@Component({
    selector: 'app-signup',
    imports: [FormularioDinamicoComponent, CardComponent],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    constructor(
        private auth_service: AuthService,
        private router: Router
    ) {}

    datos_formulario: CampoBaseFormularioDinamico<string>[] = [
        new CampoFormulario({
            llave: 'nombres',
            etiqueta: 'Nombres',
            tipo: 'text',
            clase_columna: 'col-12',
            validaciones_campo: [Validators.required, Validators.minLength(3)]
        }),
        new CampoFormulario({
            llave: 'apellidos',
            etiqueta: 'Apellidos',
            tipo: 'text',
            clase_columna: 'col-12',
            validaciones_campo: [Validators.required, Validators.minLength(3)]
        }),
        new CampoFormulario({
            llave: 'nombre_usuario',
            etiqueta: 'Usuario',
            tipo: 'text',
            clase_columna: 'col-12',
            validaciones_campo: [Validators.required, Validators.minLength(3)]
        }),
        new CampoFormulario({
            llave: 'correo',
            etiqueta: 'Correo',
            tipo: 'email',
            validaciones_campo: [Validators.pattern(REGEX_VALIDACION_CORREO)]
        }),
        new CampoFormulario({
            llave: 'contrasena',
            etiqueta: 'Contraseña (de 5 a 25 caracteres)',
            tipo: 'password',
            validaciones_campo: [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(25)
            ]
        }),
        new CampoFormulario({
            llave: 'numero_celular',
            etiqueta: 'Número Celular',
            tipo: 'tel',
            validaciones_campo: [
                Validators.minLength(10),
                Validators.maxLength(10)
            ]
        })
    ];

    formulario_valido!: boolean;
    guardar_validez_formulario(evento: boolean) {
        this.formulario_valido = evento;
    }

    valores_formulario!: UsuarioEnviar;
    guardar_valores_formulario(evento: any) {
        this.valores_formulario = evento as UsuarioEnviar;
    }

    on_submit() {
        this.crear_usuario();
    }

    crear_usuario() {
        this.auth_service
            .registrarse(this.valores_formulario)
            .subscribe((datos) => {
                this.limpiar_formulario();
                this.router.navigate(['inicio', 'signin']);
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
