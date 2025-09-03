import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[bsmostrar]',
    standalone: true
})
export class SwitchBootstrapShowDirective {
    private _mostrar_elemento: boolean = false;
    @Input() set bsmostrar(valor: boolean) {
        this._mostrar_elemento = valor;
        this.mostrar_u_ocultar();
    }

    constructor(
        private element_ref: ElementRef,
        private renderer: Renderer2
    ) {}

    private mostrar_u_ocultar(): void {
        const ESTILO = this._mostrar_elemento ? 'block' : 'none';
        this.renderer.setStyle(
            this.element_ref.nativeElement,
            'display',
            ESTILO
        );
    }
}
