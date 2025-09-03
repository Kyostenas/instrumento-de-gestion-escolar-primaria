import { Injectable } from '@angular/core';
import {
    AbstractControl,
    ValidatorFn,
    UntypedFormArray,
    FormGroup,
    FormControl
} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidacionFormularioService {
    // Si el campo tiene valores invalidos retorna false ( Esto sirve para bootstrap.)
    invalid(campo: AbstractControl): boolean {
        return campo.touched && campo.invalid;
    }

    valid(campo: AbstractControl): boolean {
        return campo.touched && campo.valid;
    }

    // Validates URL
    urlValidator(url: FormControl): any {
        if (url.pristine) {
            return null;
        }
        // tslint:disable-next-line:max-line-length
        const URL_REGEXP =
            /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        url.markAsTouched();
        if (URL_REGEXP.test(url.value)) {
            return null;
        }
        return {
            invalidUrl: true
        };
    }
    // Validates passwords
    matchPassword(group: FormGroup): any {
        const password = group.controls['password'];
        const confirm = group.controls['confirm'];
        if (password.pristine || confirm.pristine) {
            return null;
        }
        group.markAsTouched();
        if (password.value === confirm.value) {
            return null;
        }
        return {
            invalidPassword: true
        };
    }

    // Validates numbers
    numberValidator(number: FormControl): any {
        if (number.pristine) {
            return null;
        }
        const NUMBER_REGEXP = /^\-?[0-9]+(?:\.[0-9]+)?$/;
        number.markAsTouched();

        if (NUMBER_REGEXP.test(number.value)) {
            return null;
        }

        return {
            invalidNumber: true
        };
    }

    /**
     *Valida que solo sean numeros. No lo debes de llamar
    como funcion, si no como un tipo callback. 
    *
    * @param {*} number
    * @returns {*}
    * @memberof ValidacionesService
    */
    onlyIntegers(number: FormControl): any {
        if (number.pristine) {
            return null;
        }
        number.markAsTouched();
        const INTEGERS_REGEXP = /^[0-9]+$/;

        if (INTEGERS_REGEXP.test(number.value)) {
            return null;
        }

        return { notInteger: true };
    }
    // Validates US SSN
    ssnValidator(ssn: FormControl): any {
        if (ssn.pristine) {
            return null;
        }
        const SSN_REGEXP =
            /^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
        ssn.markAsTouched();
        if (SSN_REGEXP.test(ssn.value)) {
            return null;
        }
        return {
            invalidSsn: true
        };
    }
    // Validates US phone numbers
    phoneValidator(number: FormControl): any {
        if (number.pristine) {
            return null;
        }
        const PHONE_REGEXP = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        number.markAsTouched();
        if (PHONE_REGEXP.test(number.value)) {
            return null;
        }

        return {
            invalidNumber: true
        };
    }
    // Validates zip codes
    zipCodeValidator(zip: FormControl): any {
        if (zip.pristine) {
            return null;
        }
        const ZIP_REGEXP = /^[0-9]{5}(?:-[0-9]{4})?$/;
        zip.markAsTouched();
        if (ZIP_REGEXP.test(zip.value)) {
            return null;
        }
        return {
            invalidZip: true
        };
    }
    /**
     *Valida el tamano minimo de un arreglo. Sirve para un 
    arreglo.
    *
    * @param {number} [min=1] El valor minimo a comprobar. 
    * @returns {ValidatorFn}
    * @memberof ValidacionesService
    */
    minSelectedCheckboxes(min = 1) {
        const validator = (formArray: UntypedFormArray) => {
            const totalSelected = formArray.controls.length;
            return totalSelected >= min
                ? null
                : { tamanoMinimo: true, minimo: min };
        };

        return <ValidatorFn>validator;
    }

    rfc(rfc: FormControl): any {
        let _rfc_pattern_pm =
            '^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';
        // patron del RFC, persona fisica
        let _rfc_pattern_pf =
            '^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|' +
            '(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$';

        let error = { general: { mensaje: 'RFC no valido' } };
        if (!rfc.value) return null;
        if (
            rfc.value.match(_rfc_pattern_pm) ||
            rfc.value.match(_rfc_pattern_pf)
        ) {
            let r = rfc.value.length;
            if (r > 11 && r < 14) return null;
        }

        return error;
    }

    curp(curp: FormControl) {
        let curp_pattern =
            /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

        let error = { general: { mensaje: 'CURP no valida' } };
        if (!curp.value) return null;

        if (curp.value.match(curp_pattern)) {
            if (curp.value.length == 18) return null;
        }

        return error;
    }

    nss(NSS: FormControl) {
        let NSS_pattern = /^(\d{2})(\d{2})(\d{2})\d{5}$/;

        let error = { general: { mensaje: 'NSS no valido' } };
        if (!NSS.value) return null;
        if (NSS.value.match(NSS_pattern)) {
            if (NSS.value.length === 11) return null;
        }

        return error;
    }

    fechaMenorQue(
        campoFecha1: string,
        campoFecha2: string,
        campoValidador: {} = {
            general: {
                mensaje: 'Se han encontrado fechas invalidas'
            }
        }
    ): ValidatorFn {
        return (campo: AbstractControl): { [key: string]: boolean } | null => {
            const date1 = campo.get(campoFecha1)?.value;
            const date2 = campo.get(campoFecha2)?.value;
            if (date1 !== null && date2 !== null && date1 > date2) {
                campo.get(campoFecha1)?.setErrors({
                    general: {
                        mensaje:
                            'Esta fecha tiene que ser menor que la de finalizacion'
                    }
                });
                campo.get(campoFecha2)?.setErrors({
                    general: {
                        mensaje:
                            'Esta fecha tiene que ser mayor que la de inicio'
                    }
                });
                return campoValidador;
            }

            campo.get(campoFecha1)?.updateValueAndValidity({ onlySelf: true });
            campo.get(campoFecha2)?.updateValueAndValidity({ onlySelf: true });
            return null;
        };
    }
}
