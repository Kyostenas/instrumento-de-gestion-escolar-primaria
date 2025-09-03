import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDinamicoDetalleComponent } from './formulario-dinamico-detalle.component';

describe('FormularioDinamicoDetalleComponent', () => {
    let component: FormularioDinamicoDetalleComponent;
    let fixture: ComponentFixture<FormularioDinamicoDetalleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormularioDinamicoDetalleComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormularioDinamicoDetalleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
