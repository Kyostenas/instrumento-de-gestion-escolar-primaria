import { Component, inject, signal } from '@angular/core';
import { UtilidadesService } from 'src/app/services/utiles/varios/utilidades/utilidades.service';

@Component({
    selector: 'app-form-view-layout',
    imports: [],
    templateUrl: './form-view-layout.component.html',
    styleUrl: './form-view-layout.component.scss'
})
export class FormViewLayoutComponent {
    utils: UtilidadesService = inject(UtilidadesService);

    constructor() {}

    range = signal(this.utils.range(0, 300));
}
