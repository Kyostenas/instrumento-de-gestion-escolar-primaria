import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CampoBaseFormularioDinamico } from 'src/app/models/utiles/formularios/formulario-dinamico-campo-base.model';

@Injectable({
    providedIn: 'root'
})
export class FormularioDinamicoService {
    crear_formulario(campos: CampoBaseFormularioDinamico<string>[]) {
        const grupo: any = {};

        for (let i_campo = 0; i_campo < campos.length; i_campo++) {
            const datos_un_campo = campos[i_campo];
            const nuevo_campof_formulario = new FormControl(
                datos_un_campo.valor,
                datos_un_campo.validaciones_campo
            );
            grupo[datos_un_campo.llave] = nuevo_campof_formulario;
        }

        return new FormGroup(grupo);
    }
}
