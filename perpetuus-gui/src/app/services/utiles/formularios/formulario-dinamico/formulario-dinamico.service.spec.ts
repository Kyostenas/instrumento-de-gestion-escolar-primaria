import { TestBed } from '@angular/core/testing';

import { FormularioDinamicoService } from './formulario-dinamico.service';

describe('FormularioDinamicoService', () => {
    let service: FormularioDinamicoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormularioDinamicoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
