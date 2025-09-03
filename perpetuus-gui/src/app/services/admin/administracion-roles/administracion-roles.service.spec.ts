import { TestBed } from '@angular/core/testing';

import { AdministracionRolesService } from './administracion-roles.service';

describe('AdministracionRolesService', () => {
    let service: AdministracionRolesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AdministracionRolesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
