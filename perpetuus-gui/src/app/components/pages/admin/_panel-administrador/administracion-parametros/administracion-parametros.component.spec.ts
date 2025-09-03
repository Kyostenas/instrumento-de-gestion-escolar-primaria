import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionParametrosComponent } from './administracion-parametros.component';

describe('AdministracionParametrosComponent', () => {
    let component: AdministracionParametrosComponent;
    let fixture: ComponentFixture<AdministracionParametrosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministracionParametrosComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionParametrosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
