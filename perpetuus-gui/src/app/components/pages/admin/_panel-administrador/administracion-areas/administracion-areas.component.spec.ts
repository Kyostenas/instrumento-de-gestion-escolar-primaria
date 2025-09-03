import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAreasComponent } from './administracion-areas.component';

describe('AdministracionAreasComponent', () => {
    let component: AdministracionAreasComponent;
    let fixture: ComponentFixture<AdministracionAreasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministracionAreasComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionAreasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
