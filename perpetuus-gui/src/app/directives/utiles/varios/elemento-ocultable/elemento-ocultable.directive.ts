import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[ocultar]',
    standalone: true
})
export class ElementoOcultableDirective {
    private _ocultar_elemento: boolean = false;
    @Input() set ocultar(valor: boolean) {
        this._ocultar_elemento = valor;
        this.mostrar_u_ocultar();
    }

    constructor(
        private element_ref: ElementRef,
        private renderer: Renderer2
    ) {}

    private mostrar_u_ocultar(): void {
        const accion_mostrar = !this._ocultar_elemento
            ? 'addClass'
            : 'removeClass';
        const accion_ocultar = this._ocultar_elemento
            ? 'addClass'
            : 'removeClass';
        this.renderer[accion_mostrar](
            this.element_ref.nativeElement,
            'mostrar'
        );
        this.renderer[accion_ocultar](
            this.element_ref.nativeElement,
            'ocultar'
        );
    }
}
