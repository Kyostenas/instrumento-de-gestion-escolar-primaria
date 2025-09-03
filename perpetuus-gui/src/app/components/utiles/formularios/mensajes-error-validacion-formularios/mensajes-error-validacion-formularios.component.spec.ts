import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesErrorValidacionFormulariosComponent } from './mensajes-error-validacion-formularios.component';

describe('MensajesErrorValidacionFormulariosComponent', () => {
    let component: MensajesErrorValidacionFormulariosComponent;
    let fixture: ComponentFixture<MensajesErrorValidacionFormulariosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MensajesErrorValidacionFormulariosComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(
            MensajesErrorValidacionFormulariosComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
