import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdministrationListComponent } from './user-administration-list.component';

describe('UserAdministrationListComponent', () => {
    let component: UserAdministrationListComponent;
    let fixture: ComponentFixture<UserAdministrationListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserAdministrationListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserAdministrationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
