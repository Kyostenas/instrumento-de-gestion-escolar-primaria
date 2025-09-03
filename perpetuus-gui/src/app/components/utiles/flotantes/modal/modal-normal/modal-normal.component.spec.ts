import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNormalComponent } from './modal-normal.component';

describe('ModalNormalComponent', () => {
    let component: ModalNormalComponent;
    let fixture: ComponentFixture<ModalNormalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalNormalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalNormalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
