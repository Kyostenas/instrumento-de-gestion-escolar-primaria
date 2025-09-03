import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraBreadcrumbsComponent } from './barra-breadcrumbs.component';

describe('BarraBreadcrumbsComponent', () => {
    let component: BarraBreadcrumbsComponent;
    let fixture: ComponentFixture<BarraBreadcrumbsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BarraBreadcrumbsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BarraBreadcrumbsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
