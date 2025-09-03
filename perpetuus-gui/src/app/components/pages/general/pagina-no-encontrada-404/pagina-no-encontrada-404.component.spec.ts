import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNoEncontrada404Component } from './pagina-no-encontrada-404.component';

describe('PaginaNoEncontrada404Component', () => {
    let component: PaginaNoEncontrada404Component;
    let fixture: ComponentFixture<PaginaNoEncontrada404Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginaNoEncontrada404Component]
        }).compileComponents();

        fixture = TestBed.createComponent(PaginaNoEncontrada404Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
