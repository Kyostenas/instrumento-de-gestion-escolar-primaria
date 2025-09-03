import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdministrationFormComponent } from './user-administration-form.component';

describe('UserAdministrationFormComponent', () => {
    let component: UserAdministrationFormComponent;
    let fixture: ComponentFixture<UserAdministrationFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserAdministrationFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserAdministrationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
