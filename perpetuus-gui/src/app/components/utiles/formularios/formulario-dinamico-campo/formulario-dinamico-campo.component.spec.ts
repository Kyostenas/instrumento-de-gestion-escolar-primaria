import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDinamicoCampoComponent } from './formulario-dinamico-campo.component';

describe('FormularioDinamicoCampoComponent', () => {
    let component: FormularioDinamicoCampoComponent;
    let fixture: ComponentFixture<FormularioDinamicoCampoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormularioDinamicoCampoComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormularioDinamicoCampoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
