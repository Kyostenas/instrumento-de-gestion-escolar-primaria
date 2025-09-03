import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionArticulosComponent } from './administracion-articulos.component';

describe('AdministracionArticulosComponent', () => {
    let component: AdministracionArticulosComponent;
    let fixture: ComponentFixture<AdministracionArticulosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministracionArticulosComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionArticulosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
