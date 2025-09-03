import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionFlujosComponent } from './administracion-flujos.component';

describe('AdministracionFlujosComponent', () => {
    let component: AdministracionFlujosComponent;
    let fixture: ComponentFixture<AdministracionFlujosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministracionFlujosComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionFlujosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
