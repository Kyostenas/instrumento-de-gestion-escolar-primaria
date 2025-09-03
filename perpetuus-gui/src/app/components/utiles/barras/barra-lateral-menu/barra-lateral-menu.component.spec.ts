import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraLateralMenuComponent } from './barra-lateral-menu.component';

describe('BarraLateralMenuComponent', () => {
    let component: BarraLateralMenuComponent;
    let fixture: ComponentFixture<BarraLateralMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BarraLateralMenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BarraLateralMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
