import { Component, ViewChild } from '@angular/core';
import { ModalNormalComponent } from 'src/app/components/utiles/flotantes/modal/modal-normal/modal-normal.component';
import { ControlNotificacionesService } from 'src/app/services/utiles/varios/control-notificaciones/control-notificaciones.service';

@Component({
    selector: 'app-dashboard',
    imports: [ModalNormalComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    constructor(private controlNotificaciones: ControlNotificacionesService) {}

    @ViewChild('modal_de_prueba') modal_de_prueba!: ModalNormalComponent;
    mostrar_modal_de_prueba() {
        this.modal_de_prueba.mostrar_modal();
    }

    mostrar_toast_de_prueba() {
        this.controlNotificaciones.crear_notificacion({
            tipo: 'toast',
            cuerpo_mensaje: 'Notificación especial',
            titulo: 'Algo especial',
            modo: 'danger'
        });
        this.controlNotificaciones.crear_notificacion({
            tipo: 'alert',
            cuerpo_mensaje: 'Notificación especial',
            // titulo: 'Algo especial',
            modo: 'warning'
        });
    }
}
