import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAlmacenesComponent } from './administracion-almacenes.component';

describe('AdministracionAlmacenesComponent', () => {
    let component: AdministracionAlmacenesComponent;
    let fixture: ComponentFixture<AdministracionAlmacenesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdministracionAlmacenesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionAlmacenesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
