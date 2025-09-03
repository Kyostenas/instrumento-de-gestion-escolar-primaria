import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeSubMenusComponent } from './panel-de-sub-menus.component';

describe('PanelDeSubMenusComponent', () => {
    let component: PanelDeSubMenusComponent;
    let fixture: ComponentFixture<PanelDeSubMenusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PanelDeSubMenusComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PanelDeSubMenusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
