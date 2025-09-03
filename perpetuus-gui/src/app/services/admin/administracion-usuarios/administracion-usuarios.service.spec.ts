import { TestBed } from '@angular/core/testing';

import { AdministracionUsuariosService } from './administracion-usuarios.service';

describe('AdministracionUsuariosService', () => {
    let service: AdministracionUsuariosService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AdministracionUsuariosService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
