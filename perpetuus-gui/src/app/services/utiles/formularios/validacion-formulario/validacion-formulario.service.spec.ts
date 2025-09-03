import { TestBed } from '@angular/core/testing';

import { ValidacionFormularioService } from './validacion-formulario.service';

describe('ValidacionFormularioService', () => {
    let service: ValidacionFormularioService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidacionFormularioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
