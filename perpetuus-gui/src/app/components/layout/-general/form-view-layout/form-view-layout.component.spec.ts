import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormViewLayoutComponent } from './form-view-layout.component';

describe('FormViewLayoutComponent', () => {
    let component: FormViewLayoutComponent;
    let fixture: ComponentFixture<FormViewLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormViewLayoutComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FormViewLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
